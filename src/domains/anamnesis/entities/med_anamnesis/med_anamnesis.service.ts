import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';

class MedAnamnesisTypes {
  idMedicamento: number;
  idAnamnese: number;
  obs?: string;
  dosagem?: string;
  frequencia?: string;
  motivo?: string;
  id?: number;
}

@Injectable()
export class MedAnamnesisService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async createOrUpdate (data: MedAnamnesisTypes) {
    const { id, idAnamnese, idMedicamento, dosagem, frequencia, motivo, obs } = data;
    const date = new Date()

    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idMedicamento', sql.Int, idMedicamento)
        .input('obs', sql.VarChar, obs)
        .input('dosagem', sql.VarChar, dosagem)
        .input('frequencia', sql.VarChar, frequencia)
        .input('motivo', sql.VarChar, motivo)
        .input('dtCadastro', date)
        .input('dtUltAlt', date)
        .query(
          id 
          ? `
          UPDATE med_anamnese
          SET idAnamnese = @idAnamnese, idMedicamento = @idMedicamento, obs = @obs, dosagem = @dosagem, frequencia = @frequencia, motivo = @motivo, dtUltAlt = @dtUltAlt
          WHERE id = ${id};
          ` 
          : `
          INSERT INTO med_anamnese (idAnamnese, idMedicamento, obs, dosagem, frequencia, motivo, dtCadastro, dtUltAlt)
          VALUES (@idAnamnese, @idMedicamento, @obs, @dosagem, @frequencia, @motivo, @dtCadastro, @dtUltAlt);
        `);
      // const inserted = result.recordset[0];

      // return inserted;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async delete (id: number, idAnamnese: number, idMed: number) {
    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idMedicamento', sql.Int, idMed)
        .query(
          `DELETE FROM med_anamnese WHERE id = @id AND idAnamnese = @idAnamnese AND idMedicamento = @idMedicamento`
        )
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findByAnamnesisId (idAnamnese: number) {
    try {
      const result = await this.sqlCon.query(
        `SELECT *
         FROM med_anamnese
         WHERE idAnamnese = ${idAnamnese}
        `
      );
      return result.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }
}
