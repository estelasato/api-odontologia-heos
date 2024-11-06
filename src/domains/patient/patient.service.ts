import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Patient } from './dto/patient.dto';
import * as sql from 'mssql';
import { CityService } from '../city/city.service';

@Injectable()
export class PatientService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cityService: CityService,
  ) {}
  async create(createPatientDto: Patient) {
    const {
      nome,
      cpf,
      rg,
      dtNascimento,
      email,
      celular,
      sexo,
      estCivil,
      cep,
      bairro,
      complemento,
      idCidade,
      logradouro,
      numero,
      profissao,
      indicacao,
      ativo,
      responsaveis,
      habitos,
      idUser,
      typeUser,
    } = createPatientDto;

    const transaction = new sql.Transaction(this.sqlConnection);
    try {
      await transaction.begin();

      const date = new Date();
      const result = await transaction
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpf', sql.VarChar(11), cpf)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('profissao', sql.VarChar(50), profissao)
        .input('indicacao', sql.VarChar(100), indicacao)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(100), logradouro)
        .input('bairro', sql.VarChar(100), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(100), complemento)
        .input('idCidade', sql.Int, idCidade)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query`
        INSERT INTO pacientes (nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, profissao, indicacao, 
        cep, logradouro, bairro, numero, complemento, ativo, dtCadastro, dtUltAlt, idUser, typeUser)
        OUTPUT INSERTED.*
        VALUES (@nome, @cpf, @rg, @dtNascimento, @email, @celular, @sexo, @estCivil, @profissao, @indicacao,
        @cep, @logradouro, @bairro, @numero, @complemento, @ativo, @dtCadastro, @dtUltAlt, @idUser, @typeUser);
      `;
      const idPac = result.recordset[0];

      if (responsaveis || responsaveis?.length > 0) {
        // criando tabela associativa
        for (const idResp of responsaveis) {
          await transaction
            .request()
            .input('idPaciente', sql.Int, idPac.id)
            .input('idResponsavel', sql.Int, idResp.id)
            .input('dtCadastro', sql.DateTime, date)
            .input('dtUltAlt', sql.DateTime, date).query`
            INSERT INTO pac_resp (idPaciente, idResponsavel, dtCadastro, dtUltAlt)
            VALUES (@idPaciente, @idResponsavel, @dtCadastro, @dtUltAlt)
          `;
        }
      }

      if (habitos || habitos?.length > 0) {
        // criando tabela associativa
        for (const idHab of habitos) {
          await transaction
            .request()
            .input('idPaciente', sql.Int, idPac.id)
            .input('idHabito', sql.Int, idHab.id)
            .input('dtCadastro', sql.DateTime, date)
            .input('dtUltAlt', sql.DateTime, date).query`
            INSERT INTO hab_paciente (idPaciente, idHabito, dtCadastro, dtUltAlt) 
            VALUES (@idPaciente, @idHabito, @dtCadastro, @dtUltAlt)
          `;
        }
      }
      await transaction.commit();
      
      const insertedRecord = result.recordset[0];
      
      return insertedRecord;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(`Erro ao criar paciente: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('SELECT * FROM pacientes');
      return result.recordset;
    } catch (error) {
      throw new BadRequestException('Erro ao encontrar pacientes');
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `SELECT * FROM pacientes WHERE id = ${id}`,
      );

      const cep = await this.cityService.findCEP(r.recordset[0].idCidade);

      const responsaveis = await this.sqlConnection
        .request()
        .input('idPaciente', sql.Int, id).query`
          select r.id, r.nome, r.celular, r.cpf
          FROM pac_resp pr
          INNER JOIN responsaveis r on r.id = pr.idResponsavel
          WHERE pr.idPaciente = ${id}
        `;
      const listResponsaveis = responsaveis?.recordset?.map((r) => {
        return { id: r.id, nome: r.nome, celular: r.celular, cpf: r.cpf };
      });

      const habitos = await this.sqlConnection
        .request()
        .input('idPaciente', sql.Int, id).query`
          select h.id, h.nome, h.descricao
          FROM hab_paciente hp
          INNER JOIN habitos h on h.id = hp.idHabito
          WHERE hp.idPaciente = ${id}
        `;
      const listHabitos = habitos?.recordset?.map((h) => {
        return { id: h.id, nome: h.nome, descricao: h.descricao };
      });

      if (r.recordset.length > 0) {
        return {
          ...r.recordset[0],
          ...cep,
          responsaveis: [...listResponsaveis],
          habitos: [...listHabitos],
        };
      } else {
        return { error: 'Paciente não encontrado!' };
      }
    } catch (e) {
      return e;
    }
  }

  async update(id: number, updatePatientDto: Patient) {
    const {
      nome,
      cpf,
      rg,
      dtNascimento,
      email,
      celular,
      sexo,
      estCivil,
      cep,
      bairro,
      complemento,
      idCidade,
      logradouro,
      numero,
      profissao,
      indicacao,
      ativo,
      responsaveis,
      habitos,
      idUser,
      typeUser,
    } = updatePatientDto;
    const transaction = new sql.Transaction(this.sqlConnection);
    try {
      await transaction.begin();
      const date = new Date();
      const r = await transaction
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpf', sql.VarChar(11), cpf)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('profissao', sql.VarChar(50), profissao)
        .input('indicacao', sql.VarChar(100), indicacao)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(100), logradouro)
        .input('bairro', sql.VarChar(100), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(100), complemento)
        .input('idCidade', sql.Int, idCidade)
        .input('ativo', sql.Bit, ativo)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query`
        UPDATE pacientes
        SET idUser = @idUser, typeUser = @typeUser, nome = @nome, cpf = @cpf, rg = @rg, dtNascimento = @dtNascimento, email = @email, celular = @celular, 
        sexo = @sexo, estCivil = @estCivil, profissao = @profissao, indicacao = @indicacao, cep = @cep, 
        logradouro = @logradouro, bairro = @bairro, numero = @numero, complemento = @complemento, idCidade = @idCidade, 
        ativo = @ativo, dtUltAlt = @dtUltAlt
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
      `;

      if (r.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Paciente não encontrado para atualização'); // Se nenhuma linha foi atualizada
      }
      //TODO: AJUSTAR EDIÇÃO DA ASSOCIATIVA DE RESPONSÁVEIS
      // remove as associações
      await transaction.request().input('idPaciente', sql.Int, id)
        .query`DELETE FROM pac_resp WHERE idPaciente = @idPaciente`;

      if (responsaveis || responsaveis?.length > 0) {
        for (const r of responsaveis) {
          await transaction
            .request()
            .input('idPaciente', sql.Int, id)
            .input('idResponsavel', sql.Int, r.id).query`
            INSERT INTO pac_resp (idPaciente, idResponsavel)
            VALUES (@idPaciente, @idResponsavel)
          `;
        }
      }

      //TODO: AJUSTAR EDIÇÃO DA ASSOCIATIVA DE HÁBITOS
      // remove as associações
      await transaction.request().input('idPaciente', sql.Int, id)
        .query`DELETE FROM hab_paciente WHERE idPaciente = @idPaciente`;

      if (habitos || habitos?.length > 0) {
        // criando tabela associativa
        for (const idHab of habitos) {
          await transaction
            .request()
            .input('idPaciente', sql.Int, id)
            .input('idHabito', sql.Int, idHab.id)
            .input('dtCadastro', sql.DateTime, date)
            .input('dtUltAlt', sql.DateTime, date).query`
              INSERT INTO hab_paciente (idPaciente, idHabito, dtCadastro, dtUltAlt) 
              VALUES (@idPaciente, @idHabito,@dtCadastro, @dtUltAlt)
            `;
        }
      }

      await transaction.commit();

      return { message: 'Paciente salvo com sucesso!' };
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(
        `Erro ao atualizar paciente: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlConnection
        .request()
        .query(
          `delete from pacientes where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        );
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Paciente não encontrado para exclusão');
      }
      return {
        message: 'Paciente excluído com sucesso!',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao remover paciente', error.message);
    }
  }
}
