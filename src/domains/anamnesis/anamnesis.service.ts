import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AnamnesisFilter, AnamnesisTypes } from './dto/anamnesisDto';
import * as sql from 'mssql';
import { IllnessAnamnesisService } from './entities/illness_anamnesis/illness_anamnesis.service';
import { MedAnamnesisService } from './entities/med_anamnesis/med_anamnesis.service';
import { AllergiesAnamnesisService } from './entities/allergies_anamnesis/allergies_anamnesis.service';

@Injectable()
export class AnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly illnessAnamnese: IllnessAnamnesisService,
    private readonly medAnamnese: MedAnamnesisService,
    private readonly allergiesAnamnese: AllergiesAnamnesisService,
  ) {}

  async create(data: AnamnesisTypes) {
    const { idPaciente, obs, queixas, doencas, medicamentos, alergias, idUser, typeUser } = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('obs', sql.VarChar, obs)
        .input('queixas', sql.VarChar, queixas)
        .input('dtCadastro', date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar, typeUser)
        .input('dtUltAlt', date).query(`
        INSERT INTO anamneses (idPaciente, obs, queixas, dtCadastro, dtUltAlt, idUser, typeUser)
        VALUES (@idPaciente, @obs, @queixas, @dtCadastro, @dtUltAlt, @idUser, @typeUser);  
        SELECT * FROM anamneses WHERE id = SCOPE_IDENTITY()
      `);
      const inserted = result.recordset[0];

      if (doencas) {
        await Promise.all(
          doencas.map(async (d) => {
            if (d.idDoenca) {
              await this.sqlCon
                .request()
                .input('idAnamnese', sql.Int, inserted.id)
                .input('idDoenca', sql.Int, d.idDoenca)
                .input('obs', sql.VarChar, d.obs)
                .input('gravidade', sql.VarChar, d.gravidade)
                .input('cronica', sql.Bit, d.cronica)
                .input('complicacoes', sql.VarChar, d.complicacoes)
                .input('tratamento', sql.VarChar, d.tratamento)
                .input('dtCadastro', date)
                .input('dtUltAlt', date).query(`
                INSERT INTO doencas_anamnese (idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento, dtCadastro, dtUltAlt)
                VALUES (@idAnamnese, @idDoenca, @obs, @gravidade, @cronica, @complicacoes, @tratamento, @dtCadastro, @dtUltAlt)
              `);
            }
          }),
        );
      }

      if (medicamentos) {
        await Promise.all(
          medicamentos?.map(async (m) => {
            if (m.idMedicamento) {
              await this.medAnamnese.createOrUpdate({
                idAnamnese: inserted.id,
                idMedicamento: m.idMedicamento,
                dosagem: m.dosagem,
                frequencia: m.frequencia,
                motivo: m.motivo,
                obs: m.obs,
              });
            }
          }),
        );
      }

      if (alergias) {
        await Promise.all(
          alergias.map(async (a) => {
            if (a.idAlergia) {
              await this.sqlCon
                .request()
                .input('idAnamnese', sql.Int, inserted.id)
                .input('idAlergia', sql.Int, a.idAlergia)
                .input('gravidade', sql.VarChar, a.gravidade)
                .input('complicacoes', sql.VarChar, a.complicacoes)
                .input('tratamento', sql.VarChar, a.tratamento)
                .input('obs', sql.VarChar, a.obs)
                .input('dtCadastro', date)
                .input('dtUltAlt', date).query(`
                INSERT INTO alergia_anamnese (idAnamnese, idAlergia, obs, dtCadastro, dtUltAlt, gravidade, complicacoes, tratamento)
                VALUES (@idAnamnese, @idAlergia, @obs, @dtCadastro, @dtUltAlt, @gravidade, @complicacoes, @tratamento)
              `);
            }
          }),
        );
      }

      return { message: 'Salvo com sucesso!', inserted };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findAll(filter: AnamnesisFilter) {
    const { idPaciente, dataFinal, dataInicial, idAnamnese } = filter;
    let clause = [];
    if (idPaciente) clause.push(`idPaciente = ${idPaciente}`);
    if (idAnamnese) clause.push(`id = ${idAnamnese}`);
    if (dataInicial) clause.push(`dataInicio >- ${dataInicial}`);
    if (dataFinal) clause.push(`dataFim <= ${dataFinal}`);

    const clauses = clause?.length > 0 ? `WHERE ${clause.join(' AND ')}` : '';
    try {
      const r = await this.sqlCon.query(`SELECT * FROM anamneses ${clauses}`);
      return r.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlCon.query(
        `
        SELECT 
          anamneses.*, 
          (
            SELECT doencas_anamnese.*, doencas.nome as nomeDoenca
            FROM doencas
            JOIN doencas_anamnese ON doencas.id = doencas_anamnese.idDoenca
            WHERE doencas_anamnese.idAnamnese = anamneses.id
            FOR JSON PATH
          ) AS doencas,
          (
            SELECT med_anamnese.*, medicamentos.nome as nomeMedicamento
            FROM medicamentos
            JOIN med_anamnese ON medicamentos.id = med_anamnese.idMedicamento
            WHERE med_anamnese.idAnamnese = anamneses.id
            FOR JSON PATH
          ) AS medicamentos,
          (
            SELECT alergia_anamnese.*, alergias.nome as nomeAlergia
            FROM alergias
            JOIN alergia_anamnese ON alergias.id = alergia_anamnese.idAlergia
            WHERE alergia_anamnese.idAnamnese = anamneses.id
            FOR JSON PATH
          ) AS alergias
        FROM anamneses
        WHERE anamneses.id = ${id}
        `,
      );
      if (r.recordset.length > 0) {
        const data = r.recordset[0];
        if (data.doencas) {
          data.doencas = JSON.parse(data.doencas);
        }
        if (data.medicamentos) {
          data.medicamentos = JSON.parse(data.medicamentos);
        }
        if (data.alergias) {
          data.alergias = JSON.parse(data.alergias);
        }
        return data;
      } else {
        return new NotFoundException(`Não encontrado`)
      }
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async update(id: number, data: AnamnesisTypes) {
    const { idPaciente, obs, queixas, alergias, doencas, medicamentos, idUser, typeUser } = data;
    const date = new Date();

    try {
      const r = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('obs', sql.VarChar, obs)
        .input('queixas', sql.VarChar, queixas)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query(`
          UPDATE anamneses
          SET idPaciente = @idPaciente, obs = @obs, queixas = @queixas, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
          WHERE id = ${id};
          SELECT * FROM anamneses WHERE id = ${id};
          `);
      const allergiesList = await this.allergiesAnamnese.findByAnamnesisId(id);

      if (alergias?.length > 0 || allergiesList?.length > 0) {
        if (
          allergiesList?.length > 0 &&
          ((allergiesList?.length === alergias?.length &&
            alergias.some((a) => !a.id)) ||
            allergiesList?.length !== alergias?.length)
        ) {
          const ids = alergias?.map((a) => a.id);
          await Promise.all(
            allergiesList?.map(async (a) => {
              if (a.id && !ids?.includes(a.id)) {
                await this.allergiesAnamnese.delete(a.id, id, a.idAlergia);
              }
            }),
          );
        }

        await Promise.all(
          alergias?.map(async (a) => {
            if (a.idAlergia) {
              await this.allergiesAnamnese.createOrUpdate({
                id: a.id,
                idAnamnese: id,
                idAlergia: a.idAlergia,
                obs: a.obs,
                gravidade: a.gravidade,
                complicacoes: a.complicacoes,
                tratamento: a.tratamento,
              });
            }
          }),
        );
      }

      const medList = await this.medAnamnese.findByAnamnesisId(id);
      if (medicamentos?.length > 0 || medList?.length > 0) {
        if (
          medList?.length > 0 &&
          ((medList?.length === medicamentos?.length &&
            medicamentos?.some((m) => !m.id)) ||
            medList?.length !== medicamentos?.length)
        ) {
          const ids = medicamentos?.map((m) => m.id);
          await Promise.all(
            medList.map(async (m) => {
              if (m.id && !ids?.includes(m.id)) {
                await this.medAnamnese.delete(m.id, id, m.idMedicamento);
              }
            }),
          );
        }

        await Promise.all(
          medicamentos?.map(async (m) => {
            if (!!m.idMedicamento) {
              await this.medAnamnese.createOrUpdate({
                id: m.id,
                idAnamnese: id,
                idMedicamento: m.idMedicamento,
                dosagem: m.dosagem,
                frequencia: m.frequencia,
                motivo: m.motivo,
                obs: m.obs,
              });
            }
          }),
        );
      }

      const doencasList = await this.illnessAnamnese.findByAnamnesisId(id);
      // pega lista de doencas dessa anamnese
      if (doencas?.length > 0 || doencasList?.length > 0) {
        // casos de exclusão: doencasList != tamanho de doencas ou msm tamanho e algum sem id
        // remove doencas que não estão na lista de doencas
        if (
          doencasList?.length > 0 &&
          ((doencasList?.length === doencas?.length &&
            doencas.some((d) => !d.id)) ||
            doencasList?.length !== doencas?.length)
        ) {
          const ids = doencas?.map((d) => d.id);
          await Promise.all(
            doencasList?.map(async (d) => {
              if (d.id && !ids?.includes(d.id)) {
                await this.sqlCon
                  .request()
                  .input('id', sql.Int, d.id)
                  .query(
                    `DELETE FROM doencas_anamnese WHERE id = @id AND idAnamnese = ${id} AND idDoenca = ${d.idDoenca}`,
                  );
              }
            }),
          );
        }

        await Promise.all(
          doencas?.map(async (d) => {
            if (d.idDoenca) {
              await this.sqlCon
                .request()
                .input('idAnamnese', sql.Int, id)
                .input('idDoenca', sql.Int, d.idDoenca)
                .input('obs', sql.VarChar, d.obs)
                .input('gravidade', sql.VarChar, d.gravidade)
                .input('cronica', sql.Bit, d.cronica)
                .input('complicacoes', sql.VarChar, d.complicacoes)
                .input('tratamento', sql.VarChar, d.tratamento)
                .input('dtUltAlt', date)
                .input('dtCadastro', date)
                .query(
                  d.id
                    ? `
                UPDATE doencas_anamnese
                SET idDoenca = @idDoenca, obs = @obs, gravidade = @gravidade, cronica = @cronica, complicacoes = @complicacoes, tratamento = @tratamento, dtUltAlt = @dtUltAlt
                WHERE id = ${d.id}
              `
                    : `
                INSERT INTO doencas_anamnese (idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento, dtUltAlt, dtCadastro)
                VALUES (@idAnamnese, @idDoenca, @obs, @gravidade, @cronica, @complicacoes, @tratamento, @dtUltAlt, @dtCadastro)
                    `,
                );
            }
          }),
        );
      }

      if (r.rowsAffected[0] === 0) {
        throw new NotFoundException('Anamnese não encontrada');
      }

      return {
        message: 'Anamnese atualizada com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async remove(id: number) {
    try {
      const illness = await this.illnessAnamnese.findByAnamnesisId(id);
      const med = await this.medAnamnese.findByAnamnesisId(id);
      const allergies = await this.allergiesAnamnese.findByAnamnesisId(id);

      if (illness && illness.length > 0) {
        illness?.map(async(i) => await this.illnessAnamnese.delete(i.id, id, i.idDoenca));
      }
      if (med && med.length > 0) {
        med?.map(async(m) => await this.medAnamnese.delete(m.id, id, m.idMedicamento));
      }
      if (allergies && allergies.length > 0) {
        allergies?.map(async(a) => await this.allergiesAnamnese.delete(a.id, id, a.idAlergia));
      } 

      await this.sqlCon.request().query(`
          DELETE FROM anamneses WHERE ID = ${id}
        `);
      return {
        message: 'Anamnese removida com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }
}
