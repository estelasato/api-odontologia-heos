import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';

export class AllergiesAnamnesisType {
  id?: number
  idAnamnese: number
  idAlergia: number
  obs?: string
  gravidade?: string
  complicacoes?: string
  tratamento?: string
}

@Injectable()
export class AllergiesAnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async createOrUpdate (data: AllergiesAnamnesisType) {
    const { idAlergia,idAnamnese,complicacoes,gravidade,id,obs,tratamento} = data
    const date = new Date()

    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input(idAlergia, sql.Int, idAlergia)
        .input(idAnamnese, sql.Int, idAnamnese)
        .input(obs, sql.VarChar, obs)
        .input(gravidade, sql.VarChar, gravidade)
        .input(complicacoes, sql.VarChar, complicacoes)
        .input(tratamento, sql.VarChar, tratamento)
        .input('dtCadastro', date)
        .input('dtUltAlt', date)
        .query(
          id ?
          `
            UPDATE alergia_anamnese
            SET idAnamnese = @idAnamnese, idAlergia = @idAlergia, obs = @obs, gravidade = @gravidade, complicacoes = @complicacoes, tratamento = @tratamento, dtUltAlt = @dtUltAlt
            WHERE id = ${id};
            ` :
          `
            INSERT INTO alergia_anamnese (idAnamnese, idAlergia, obs, gravidade, complicacoes, tratamento, dtCadastro, dtUltAlt)
            VALUES (@idAnamnese, @idAlergia, @obs, @gravidade, @complicacoes, @tratamento, @dtCadastro, @dtUltAlt);
          ` 
        )
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`)
    }
  }

  async delete (id: number, idAnamnese: number, idMed: number) {
    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idAlergia', sql.Int, idMed)
        .query(
          `DELETE FROM alergia_anamnese WHERE id = @id AND idAnamnese = @idAnamnese AND idAlergia = @idAlergia`
        )
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findByAnamnesisId (idAnamnese: number) {
    try {
      const result = await this.sqlCon.query(
        `SELECT *
         FROM alergia_anamnese
         WHERE idAnamnese = ${idAnamnese}
        `
      );
      return result.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }
}




