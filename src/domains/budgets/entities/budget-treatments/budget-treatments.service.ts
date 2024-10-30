import { Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';

export class BudgetTreatmentsType {
  id?: number;
  idOrcamento: number;
  idTratamento: number;
  obs?: string;
  total?: number;
}

@Injectable()
export class BudgetTreatmentsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async remove (id: number, idBudget: number) {
    try {
      await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .query(
          `DELETE FROM orc_tratamento WHERE id = @id AND idOrcamento = ${idBudget}`
        )
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`)
    }
  }

  async findByBudgetId(id: number) {
    try {
      // const result = await this.sqlCon.query(`
      //   SELECT ot.id as id, ot.idTratamento as idTatamento, ot.idOrcamento as idOrcamento, ot.obs as obs, ot.valor as valor, ot.qtd as qtd, ot.total as total, t.descricao as descricao
      //   FROM orc_tratamento ot
      //   INNER JOIN tratamentos t ON ot.idTratamento = t.id
      //   WHERE ot.idOrcamento = ${id}
      // `);
      const result = await this.sqlCon.query(`
        SELECT orc_tratamento.*, tratamentos.descricao as descricao 
        FROM orc_tratamento
        JOIN tratamentos
        ON tratamentos.id = orc_tratamento.idTratamento 
        WHERE idOrcamento = ${id}
        `)
      return result.recordset;
    } catch (error) {
      throw new Error(`Erro ao buscar tratamentos: ${error}`);
    }
  }

}
