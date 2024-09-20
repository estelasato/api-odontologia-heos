import { BadRequestException, Inject } from "@nestjs/common";
import * as sql from 'mssql';

class IllnessAnamnesisDto {
  obs?: string;
  gravidade?: string;
  cronica?: boolean;
  complicacoes?: string;
  tratamento?: string;
  idDoenca: number;
  idAnamnese: number;
}

export class IllnessAnamnesis {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ){}

  async create(data: IllnessAnamnesisDto) {
    const { idAnamnese, idDoenca, complicacoes, cronica, gravidade, obs, tratamento} = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('idAnamnese', sql.Int, idAnamnese)
        .input('idDoenca', sql.Int, idDoenca)
        .input('complicacoes', sql.VarChar, complicacoes)
        .input('cronica', sql.Bit, cronica)
        .input('gravidade', sql.VarChar, gravidade)
        .input('obs', sql.VarChar, obs)
        .input('tratamento', sql.VarChar, tratamento)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
        INSERT INTO doencas_anamneses (idAnamnese, idDoenca, complicacoes, cronica, gravidade, obs, tratamento, dtCadastro, dtUltAlt)
        VALUES (@idAnamnese, @idDoenca, @complicacoes, @cronica, @gravidade, @obs, @tratamento, @dtCadastro, @dtUltAlt
        SELECT * FROM anamneses_doencas WHERE id = SCOPE_IDENTITY()
          `);

      const inserted = result.recordset[0];

      return { message: 'criado com sucesso!', inserted };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e}`);
    }
  } 
}