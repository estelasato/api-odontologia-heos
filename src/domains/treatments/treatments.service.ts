import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  TreatmentDto,
  TreatmentFilter,
  TreatmentTypes,
  UpdateTreatmentDto,
} from './dto/treatment.dto';
import * as sql from 'mssql';

@Injectable()
export class TreatmentsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}
  async create(data: TreatmentTypes) {
    const {
      dataInicio,
      dataFim,
      dente,
      descricao,
      idPaciente,
      idProfissional,
      idAnamnese,
      idUser,
      typeUser,
      idProcedimento,
    } = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('dataInicio', sql.DateTime, dataInicio)
        .input('dataFim', sql.DateTime, dataFim)
        .input('dente', sql.VarChar(50), dente)
        .input('descricao', sql.VarChar(50), descricao)
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idProcedimento', sql.Int, idProcedimento)
        .input('dtCadastro', date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query(`
        INSERT INTO tratamentos (idProcedimento, dataInicio, dataFim, dente, descricao, idPaciente, idProfissional, dtCadastro, dtUltAlt, idAnamnese, idUser, typeUser)
        VALUES (@idProcedimento, @dataInicio, @dataFim, @dente, @descricao, @idPaciente, @idProfissional, @dtCadastro, @dtUltAlt, @idAnamnese, @idUser, @typeUser);  
        SELECT * FROM tratamentos WHERE id = SCOPE_IDENTITY()
      `);

      const inserted = result.recordset[0];

      return { message: 'Tratamento criado com sucesso!', inserted };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findAll(filter?: TreatmentFilter) {
    const { dataFinal, dataInicial, idPaciente, idProfissionais, idAnamnese } =
      filter;
    let whereClauses = [];
    if (idPaciente) {
      whereClauses.push(`idPaciente = ${idPaciente}`);
    }

    if (idAnamnese) {
      whereClauses.push(`idAnamnese = ${idAnamnese}`);
    }

    if (idProfissionais && idProfissionais.length > 0) {
      whereClauses.push(
        `idProfissional IN (${idProfissionais?.map((p) => `'${p}'`).join(',')})`,
      );
    }

    if (dataInicial) whereClauses.push(`dataInicio >= '${dataInicial}'`);

    if (dataFinal) whereClauses.push(`dataFim <= '${dataFinal}'`);

    const whereClause =
      whereClauses?.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    try {
      const r = await this.sqlCon.query(
        `SELECT * FROM tratamentos ${whereClause}`,
      );
      return r.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlCon.query(
        `
        SELECT tratamentos.*, pacientes.nome AS namePaciente, profissionais.nome AS nameProfissional
        FROM tratamentos
        JOIN pacientes ON tratamentos.idPaciente = pacientes.id
        JOIN profissionais ON tratamentos.idProfissional = profissionais.id
        JOIN anamneses ON tratamentos.idAnamnese = anamneses.id
        WHERE tratamentos.id = ${id}
        `,
      );

      if (r.recordset.length > 0) {
        return r.recordset[0];
      } else {
        return { error: 'Tratamento não encontrado' };
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async update(id: number, data: UpdateTreatmentDto): Promise<any> {
    const {
      idPaciente,
      idProfissional,
      dataFim,
      dataInicio,
      dente,
      descricao,
      idAnamnese,
      idUser,
      typeUser,
    } = data;
    const date = new Date();

    try {
      const r = await this.sqlCon
        .request()
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('dataFim', sql.DateTime, dataFim)
        .input('dataInicio', sql.DateTime, dataInicio)
        .input('dente', sql.VarChar, dente)
        .input('descricao', sql.VarChar, descricao)
        .input('dtUltALt', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('id', sql.Int, id)
        .query(
          `UPDATE tratamentos
        SET idAnamnese = @idAnamnese, idPaciente = @idPaciente, idProfissional = @idProfissional, dataFim = @dataFim, dataInicio = @dataInicio, dente = @dente, descricao = @descricao, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
        WHERE id = @id;
        SELECT @@ROWCOUNT AS rowsAffected;
        `,
        );

      if (r.rowsAffected[0] === 0) {
        throw new NotFoundException('Tratamento não encontrado');
      }

      return {
        message: 'Tratamento atualizado com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException('Erro', e);
    }
  }

  async remove(id: number) {
    try {
      const r = await this.sqlCon
        .request()
        .query(`DELETE FROM tratamentos WHERE id = ${id}`);
      if (r.recordset[0].rowsAffected === 0) {
        throw new BadRequestException('Erro ao remover tratamento');
      }

      return {
        message: 'tratamento removido com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException('Erro ao remover tratamento', e);
    }
  }
}
