import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ScheduleFilter, ScheduleTypes } from './dto/schedule.dto';
import * as sql from 'mssql';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: ScheduleTypes) {
    const { idPaciente, idProfissional, horario, duracao, obs, status } = data;
    const date = new Date();
    try {
      const r = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('horario', sql.DateTime, horario)
        .input('duracao', sql.Int, duracao)
        .input('obs', sql.VarChar(100), obs)
        .input('status', sql.VarChar(20), status)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query`
        INSERT INTO agendas (idPaciente, idProfissional, horario, duracao, obs, status, dtCadastro, dtUltAlt)
        VALUES (@idPaciente, @idProfissional, @horario, @duracao, @obs, @status, @dtCadastro, @dtUltAlt)
        SELECT * FROM funcionarios WHERE id = SCOPE_IDENTITY()
      `;
      return {
        message: 'Agendado com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findAll(filter: ScheduleFilter) {
    const { dataInicial, dataFinal, statusList, idPacientes, idProfissionais } =
      filter;
    try {
      let whereClauses = [];
      if (statusList && statusList.length > 0) {
        whereClauses.push(
          `status IN (${statusList?.map((s) => `'${s}'`).join(',')})`,
        );
      }
      if (idPacientes && idPacientes.length > 0) {
        whereClauses.push(`idPaciente IN (${idPacientes?.join(',')})`);
      }
      if (idProfissionais && idProfissionais.length > 0) {
        whereClauses.push(`idProfissional IN (${idProfissionais?.join(',')})`);
      }
      if (dataInicial) {
        whereClauses.push(`horario >= '${dataInicial}'`);
      }
      if (dataFinal) {
        whereClauses.push(`horario <= '${dataFinal}'`);
      }

      const whereClause =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      const result = await this.sqlCon.query(
        `SELECT agendas.*, pacientes.nome AS nomePaciente, profissionais.nome AS nomeProfissional
        FROM agendas ${whereClause}
        JOIN pacientes ON agendas.idPaciente = pacientes.id
        JOIN profissionais ON agendas.idProfissional = profissionais.id`,
      );
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlCon.query(
        `SELECT agendas.* 
        FROM agendas
        JOIN pacientes ON pacientes.id = agendas.idPaciente
        JOIN profissionais ON profissionais.id = agendas.idProfissional
        WHERE agendas.id = ${id}`,
      );
      return r.recordset[0]

    } catch(e) {
      throw new BadRequestException('Erro ao buscar consulta', e)
    }
  }

  async update(id: number, data: ScheduleTypes) {
    const { horario, idPaciente, idProfissional, duracao, obs, status } = data;
    const date = new Date();

    try {
      const result = await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('horario', sql.DateTime, horario)
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('duracao', sql.Int, duracao)
        .input('obs', sql.VarChar(100), obs)
        .input('status', sql.VarChar(20), status)
        .input('dtUltAlt', date).query`
        UPDATE agendas 
        SET horario = @horario, idPaciente = @idPaciente, idProfissional = @idProfissional, duracao = @duracao, obs = @obs, status = @status, dtUltAlt = @dtUltAlt
        WHERE id = ${id};
        SELECT @@ROWCOUNT AS rowsAffected;
        `;
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Agendamento não encontrado!');
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Erro ao atualizar consulta: ${e.message}`);
    }

    return `This action updates a #${id} schedule`;
  }

  async remove(id: number) {
    try {
      const r = await this.sqlCon.request().query(
        `DELETE FROM agendas WHERE id = ${id}; 
        SELECT @@ROWCOUNT AS rowsAffected`
      );

      if (r.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Consulta não encontrada para exclusão')
      }

      return {
        message: 'Consulta removida com sucesso!'
      };
    } catch(e) {
      throw new BadRequestException('Erro ao remover consulta', e.message);

    }
  }
}
