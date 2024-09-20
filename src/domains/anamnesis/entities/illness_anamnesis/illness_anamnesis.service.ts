import { Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { IllnessAnamnesisDto } from './dto/illness_anamnesis.dto';

@Injectable()
export class IllnessAnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create (data: IllnessAnamnesisDto) {
    const { idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento } = data;
    const date = new Date()

    try {
      const result = await this.sqlCon
        .request()
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idDoenca', sql.Int, idDoenca)
        .input('obs', sql.VarChar, obs)
        .input('gravidade', sql.VarChar, gravidade)
        .input('cronica', sql.Bit, cronica)
        .input('complicacoes', sql.VarChar, complicacoes)
        .input('tratamento', sql.VarChar, tratamento)
        .input('dtCadastro', date)
        .input('dtUltAlt', date)
        .query(`
          INSERT INTO doencas_anamnese (idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento)
          VALUES (@idAnamnese, @idDoenca, @obs, @gravidade, @cronica, @complicacoes, @tratamento);
          SELECT * FROM doencas_anamnese WHERE id = SCOPE_IDENTITY()
        `);
      const inserted = result.recordset[0];

      return inserted;
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findByAnamnesisId (idAnamnese: number) {
    try {
      const result = await this.sqlCon.query(
        `SELECT *
         FROM doencas_anamnese
         WHERE idAnamnese = ${idAnamnese}
        `
      );
      return result.recordset;
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }
}
