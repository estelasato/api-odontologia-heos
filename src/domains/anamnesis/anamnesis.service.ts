import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnamnesisFilter, AnamnesisTypes } from './dto/anamnesisDto';
import * as sql from 'mssql';

@Injectable()
export class AnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: AnamnesisTypes) {
    const {idPaciente, obs, queixas } = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('obs', sql.VarChar, obs)
        .input('queixas', sql.VarChar, queixas)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
        INSERT INTO anamneses (idPaciente, obs, queixas, dtCadastro, dtUltAlt)
        VALUES (@idPaciente, @obs, @queixas, @dtCadastro, @dtUltAlt);  
        SELECT * FROM anamneses WHERE id = SCOPE_IDENTITY()
      `);
      const inserted = result.recordset[0];

      return { message: 'Anamnese criada com sucesso!', inserted };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findAll(filter: AnamnesisFilter) {
    const { idPaciente } = filter;
    let clause
    if (idPaciente) clause = `WHERE idPaciente = ${idPaciente}`

    try {
      const r = await this.sqlCon.query(`SELECT * FROM anamneses ${clause}`);
      return r.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlCon.query(
        `SELECT * FROM anamneses WHERE id = ${id}`,
      );
      if (r.recordset.length > 0) {
        return r.recordset[0];
      } else {
        return { error: 'Tratamento não encontrado' };
      }
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async update(id: number, data: AnamnesisTypes) {
    const { idPaciente, obs, queixas } = data;
    const date = new Date();

    try {
      const r = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('obs', sql.VarChar, obs)
        .input('queixas', sql.VarChar, queixas)
        .input('dtUltAlt', date).query(`
          UPDATE anamneses
          SET idPaciente = @idPaciente, obs = @obs, queixas = @queixas, dtUltAlt = @dtUltAlt
          WHERE id = ${id};
          SELECT * FROM anamneses WHERE id = ${id};
          `);
      if (r.rowsAffected[0] === 0) {
        throw new NotFoundException('Tratamento não encontrado');
      }

      return {
        message: 'Tratamento atualizado com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async remove(id: number) {
    try {
      const r = await this.sqlCon.request().query(`
          DELETE FROM anamneses WHERE ID = ${id}
        `);
      return {
        message: 'tratamento removido com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }
}
