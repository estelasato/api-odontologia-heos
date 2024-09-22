import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';

export class IllnessAnamnesisTypes {
  id?: number;
  idDoenca: number;
  idAnamnese: number;
  obs?: string;
  gravidade?: string;
  cronica?: boolean;
  complicacoes?: string;
  tratamento?: string;
}

@Injectable()
export class IllnessAnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async createOrUpdate (data: IllnessAnamnesisTypes) {
    const { id, idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento } = data;
    const date = new Date()

    try {
      const result = await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idDoenca', sql.Int, idDoenca)
        .input('obs', sql.VarChar, obs)
        .input('gravidade', sql.VarChar, gravidade)
        .input('cronica', sql.Bit, cronica)
        .input('complicacoes', sql.VarChar, complicacoes)
        .input('tratamento', sql.VarChar, tratamento)
        .input('dtCadastro', date)
        .input('dtUltAlt', date)
        .query( id ? 
          `
            UPDATE doencas_anamnese (idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento, dtUltAlt)
            SET idAnamnese = @idAnamnese, idDoenca = @idDoenca, obs = @obs, gravidade = @gravidade, cronica = @cronica, complicacoes = @complicacoes, tratamento = @tratamento, dtUltAlt = @dtUltAlt
            WHERE id = ${id};
          ` :
          `
          INSERT INTO doencas_anamnese (idAnamnese, idDoenca, obs, gravidade, cronica, complicacoes, tratamento)
          VALUES (@idAnamnese, @idDoenca, @obs, @gravidade, @cronica, @complicacoes, @tratamento);
          SELECT * FROM doencas_anamnese WHERE id = SCOPE_IDENTITY()
        `);
      // const inserted = result.recordset[0];

      // return inserted;
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }

  async delete (id: number, idAnamnese: number, idDoenca: number) {
    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idDoenca', sql.Int, idDoenca)
        .query(
          `DELETE FROM doencas_anamnese WHERE id = @id AND idAnamnese = @idAnamnese AND idDoenca = @idDoenca`
        )
    } catch (e) {
      throw new BadRequestException(`erro illness anamnese: ${e.message}`);
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
