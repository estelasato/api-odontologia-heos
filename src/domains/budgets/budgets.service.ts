import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  budgetFilter,
  createBudgetDto,
} from './dto/create-budget.dto';
import { updateBudgetDto } from './dto/update-budget.dto';
import * as sql from 'mssql';
import { BudgetProcedureService } from './entities/budget-procedure/budget-treatments.service';

@Injectable()
export class BudgetsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly budgeProcedureService: BudgetProcedureService,  ) {}

  async create(data: createBudgetDto) {
    const {
      idPaciente,
      idProfissional,
      total,
      status,
      procedimentos,
      idUser,
      typeUser,
      obs,
      percDesconto      
    } = data;
    const date = new Date();
    const trans = new sql.Transaction(this.sqlCon);

    try {
      await trans.begin();
      const request = new sql.Request(trans);
      request.queryTimeout = 60000; // Aumentar o tempo limite da consulta para 60 segundos

      const result = await request
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('sumTotal', sql.Decimal, total)
        .input('status', sql.VarChar(20), status)
        .input('obs', sql.VarChar(100), obs)
        .input('percDesconto', sql.Decimal, percDesconto)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtCadastro', sql.DateTime, date)
        .input('dtUltAlt', sql.DateTime, date).query(`
          INSERT INTO orcamentos (idUser, typeUser, idPaciente, idProfissional, total, status, dtCadastro, dtUltAlt, percDesconto, obs)
          OUTPUT INSERTED.*
          VALUES (@idUser, @typeUser, @idPaciente, @idProfissional, @sumTotal, @status, @dtCadastro, @dtUltAlt, @percDesconto, @obs);
        `);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('Falha ao inserir orçamento.');
      }
      const budgetId = result.recordset[0].id;

      for (let t of procedimentos) {
        const request = new sql.Request(trans);
        await request
          .input('idOrcamento', sql.Int, budgetId)
          .input('idProcedimento', sql.Int, t.idProcedimento)
          .input('obs', sql.VarChar(100), t.obs)
          .input('qtd', sql.Int, t.qtd)
          .input('total', sql.Decimal, t.total)
          .input('valor', sql.Decimal, t.valor).query(`
            INSERT INTO orc_procedimento (idOrcamento, idProcedimento, obs, qtd, total, valor)
            VALUES (@idOrcamento, @idProcedimento, @obs, @qtd, @total, @valor);
          `);
      }

      await trans.commit();
      return result.recordset[0]
    } catch (error) {
      await trans.rollback();
      throw new Error(`Erro : ${error.message}`);
    }
  }

  async findAll(filter: budgetFilter) {
    const {
      dataFinal,
      dataInicial,
      idPaciente,
      idProfissional,
      status,
    } = filter;
    let clause = [];
    // if (idAnamnese) clause.push(`idAnamnese = ${idAnamnese}`);
    if (idPaciente) clause.push(`idPaciente = ${idPaciente}`);
    // if (idProfissional) clause.push(`idProfissional = ${idProfissional}`);
    if (dataInicial) clause.push(`dtCadastro >= ${dataInicial}`);
    if (dataFinal) clause.push(`dtCadastro <= ${dataFinal}`);
    if (status) clause.push(`status = ${status}`);

    const clauses = clause?.length > 0 ? `WHERE ${clause.join(' AND ')}` : '';
    try {
      const result = await this.sqlCon.query(
        `select * from orcamentos ${clauses}`,
      );
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(
        `Erro ao buscar orcamentos:  ${err.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from orcamentos where id=${id}`,
      );

      const procedimentos = await this.budgeProcedureService.findByBudgetId(id);
      // const contasReceber = await this.accReceivableService.findAll({
      //   idOrcamento: id,
      // });

      result.recordset[0].procedimentos = procedimentos;
      // result.recordset[0].contasReceber = contasReceber;

      if (result.recordset.length === 0) {
        throw new NotFoundException('Orçamento não encontrado');
      }
      return result.recordset[0];
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
  async update(id: number, data: updateBudgetDto) {
    const {
      idPaciente,
      idProfissional,
      status,
      total,
      procedimentos,
      obs,
      percDesconto,
      idUser,
      typeUser,
    } = data;
    const trans = new sql.Transaction(this.sqlCon);
    await trans.begin();
    try {
      // const tableRequest = new sql.Request(trans);
      // tableRequest.queryTimeout = 60000; // Aumentar o tempo limite da consulta para 60 segundos
      const date = new Date();

      const result = await this.sqlCon
        .request()
        // const result = await tableRequest
        .input('idPaciente', sql.Int, idPaciente)
        .input('idProfissional', sql.Int, idProfissional)
        .input('sumTotal', sql.Decimal, total)
        .input('status', sql.VarChar(20), status)
        .input('obs', sql.VarChar(100), obs)
        .input('percDesconto', sql.Decimal, percDesconto)
        .input('dtUltAlt', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('id', sql.Int, id).query(`
          UPDATE orcamentos 
          SET idUser=@idUser, typeUser=@typeUser, idPaciente = @idPaciente, idProfissional = @idProfissional, total = @sumTotal, status = @status, dtUltAlt = @dtUltAlt, percDesconto = @percDesconto, obs = @obs
          WHERE id = @id;
        `);

      const listProc = await this.budgeProcedureService.findByBudgetId(id);

      if (listProc.length > 0 || procedimentos.length > 0) {
        if (
          listProc.length > 0 &&
          ((listProc.length === procedimentos.length &&
            procedimentos.some((t) => !t.id)) ||
            listProc.length !== procedimentos.length)
        ) {
          const ids = procedimentos?.map((t) => t.id && t.id);
          await Promise.all(
            listProc?.map(async (t) => {
              if (t.id && !ids?.includes(t.id)) {
                // const orcTratamRequest = new sql.Request(trans);
                // orcTratamRequest
                await this.sqlCon
                  .request()
                  .input('idOrcProc', sql.Int, t.id)
                  .input('idProc', sql.Int, t.idProcedimento).query(`
                    DELETE FROM orc_procedimentos 
                    WHERE id = @idOrcProc AND idOrcamento = @id AND idProcedimento = @idProc;
                  `);
              }
            }),
          );
        }

        await Promise.all(
          procedimentos?.map(async (t) => {
            // const createAssociative = new sql.Request(trans);
            // createAssociative
            await this.sqlCon
              .request()
              .input('idOrcamento', sql.Int, id)
              .input('idProcedimento', sql.Int, t.idProcedimento)
              .input('obs', sql.VarChar(100), t.obs)
              .input('qtd', sql.Int, t.qtd)
              .input('total', sql.Decimal, t.total)
              .input('idOrcTratam', sql.Int, t.id)
              .input('valor', sql.Decimal, t.valor)
              .query(
                t.id
                  ? `
                  UPDATE orc_procedimento
                  SET valor = @valor, idOrcamento = @idOrcamento, idProcedimento = @idProcedimento, obs = @obs, qtd = @qtd, total = @total
                  WHERE id = @idOrcTratam AND idOrcamento = @idOrcamento AND idProcedimento = @idProcedimento;
                  `
                  : `
                INSERT INTO orc_procedimento (valor, idOrcamento, idProcedimento, obs, qtd, total)
                VALUES (@valor, @idOrcamento, @idProcedimento, @obs, @qtd, @total);
                `,
              );
          }),
        );
      }

      // await trans.commit();

      if (result.rowsAffected[0] === 1) {
        return { message: 'Atualizado com sucesso!' };
      } else {
        return { error: 'Nenhum registro atualizado' };
      }
    } catch (error) {
      // try {
      //   await trans.rollback();
      // } catch (rollbackError) {
      //   console.error('Erro ao reverter a transação:', rollbackError);
      // }
      throw new BadRequestException(
        `Erro ao atualizar orcamento: ${error.message}`,
      );
    }
  }
  async remove(id: number) {
    try {
      const tratmentos = await this.budgeProcedureService.findByBudgetId(id);

      if (tratmentos.length > 0) {
        Promise.all(
          tratmentos.map(async (t) => {
            await this.budgeProcedureService.remove(t.id, id);
          }),
        );
      }

      await this.sqlCon.query`DELETE FROM orcamentos WHERE id = ${id}`;
      return {
        message: 'Orçamento deletado com sucesso!',
      };
    } catch (error) {
      throw new BadRequestException(
        `Erro ao deletar orcamento: ${error.message}`,
      );
    }
  }
}
