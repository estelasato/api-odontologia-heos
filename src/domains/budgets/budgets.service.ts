import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { budgetFilter, createBudgetDto, CreateBudgetDto } from './dto/create-budget.dto';
import { updateBudgetDto, UpdateBudgetDto } from './dto/update-budget.dto';
import * as sql from 'mssql';
import { BudgetTreatmentsService } from './entities/budget-treatments/budget-treatments.service';


@Injectable()
export class BudgetsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly budgetTreatmentService: BudgetTreatmentsService,
  ) {}

  async create(data: createBudgetDto) {
    const trans = new sql.Transaction(this.sqlCon);
    const { idAnamnese,idPaciente, idProfissional,idCondPagamento, total,status, tratamentos } = data;
    const date = new Date();

    try {
      await trans.begin();
      const tableRequest = new sql.Request(trans)
      const result = await tableRequest
      .input('idAnamnese', sql.Int, idAnamnese)
      .input('idPaciente', sql.Int, idPaciente)
      .input('idProfissional', sql.Int, idProfissional)
      .input('idCondPagamento', sql.Int, idCondPagamento)
      .input('total', sql.Decimal, total)
      .input('status', sql.VarChar(20), status)
      .input('dtCadastro', sql.DateTime, date)
      .input('dtUltAlt', sql.DateTime, date)
      .query`
        INSERT INTO orcamentos (idAnamnese, idPaciente, idProfissional, idCondPagamento, total, status, dtCadastro, dtUltAlt)
        VALUES (@idAnamnese, @idPaciente, @idProfissional, @idCondPagamento, @total, @status, @dtCadastro, @dtUltAlt)
        SELECT * FROM orcamentos WHERE id = SCOPE_IDENTITY()
        `;
      console.log(result.recordset);
      const budgetId = result.recordset[0].id;

      for (let t of tratamentos) {
        const tratamentosRequest = new sql.Request(trans)
        await tratamentosRequest
        .input('idOrcamento', sql.Int, budgetId)
        .input('idTratamento', sql.Int, t.idTratamento)
        .input('obs', sql.VarChar(100), t.obs)
        .input('qtd', sql.Int, t.qtd)
        .input('total', sql.Decimal, t.total)
        .input('valor', sql.Decimal, t.valor)
        .query`
          INSERT INTO orc_tratamento (idOrcamento, idTratamento, obs, qtd, total, valor)
          VALUES (@idOrcamento, @idTratamento, @obs, @qtd, @total, @valor)
        `;
      }

      await trans.commit();
      return { message: 'Criado com sucesso!' };
    } catch (error) {
      await trans.rollback();
      throw new Error(`Erro : ${error.message}`);
    }
  }

  async findAll(filter: budgetFilter) {
    const {dataFinal,dataInicial,idAnamnese,idPaciente,idProfissional, status} = filter
    let clause = []
    if (idAnamnese) clause.push(`idAnamnese = ${idAnamnese}`)
    if (idPaciente) clause.push(`idPaciente = ${idPaciente}`)
    if (idProfissional) clause.push(`idProfissional = ${idProfissional}`)
    if (dataInicial) clause.push(`dtCadastro >= ${dataInicial}`)
    if (dataFinal) clause.push(`dtCadastro <= ${dataFinal}`)
    if (status) clause.push(`status = ${status}`)

    const clauses = clause?.length > 0 ? `WHERE ${clause.join(' AND ')}` : '';
    try {
      const result = await this.sqlCon.query(`select * from orcamentos ${clauses}`);
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar orcamentos:  ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from orcamentos where id=${id}`,
      );

      const tratamentos = await this.budgetTreatmentService.findByBudgetId(id);

      result.recordset[0].tratamentos = tratamentos;
      if (result.recordset.length === 0) {
        throw new NotFoundException('Orçamento não encontrado');
      }
      return result.recordset[0];
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async update(id: number, data: updateBudgetDto) {
    const {idAnamnese,idCondPagamento,idPaciente,idProfissional,status,total,tratamentos} = data
    try{
      const trans = new sql.Transaction(this.sqlCon);
      await trans.begin();

      const tableRequest = new sql.Request(trans)
      const date = new Date();

      const result = await tableRequest
      .input('idAnamnese', sql.Int, idAnamnese)
      .input('idPaciente', sql.Int, idPaciente)
      .input('idProfissional', sql.Int, idProfissional)
      .input('idCondPagamento', sql.Int, idCondPagamento)
      .input('total', sql.Decimal, total)
      .input('status', sql.VarChar(20), status)
      .input('dtUltAlt', sql.DateTime, date)
      .input('id', sql.Int, id)
      .query`
        UPDATE orcamentos 
        SET idAnamnese = @idAnamnese, idPaciente = @idPaciente, idProfissional = @idProfissional, idCondPagamento = @idCondPagamento, total = @total, status = @status, dtUltAlt = @dtUltAlt
        WHERE id = @id;
      `;

      const listTratam = await this.budgetTreatmentService.findByBudgetId(id);

      if (listTratam.length > 0 || tratamentos.length > 0) {
        if (listTratam.length > 0 && 
          ((listTratam.length === tratamentos.length && tratamentos.some((t) => !t.id)) || 
        listTratam.length != tratamentos.length)
        ) {
          const ids = tratamentos?.map((t) => t.id);
          await Promise.all(
            listTratam?.map(async(t) => {
              if (t.id && !ids?.includes(t.id)) {
                await tableRequest
                .input('id', sql.Int, t.id)
                .query`DELETE FROM orc_tratamento WHERE id = @id AND idOrcamento = ${id}`;
              }
            })
          )
        }

        await Promise.all(
          tratamentos?.map(async(t) => {
            await tableRequest
            .input('idOrcamento', sql.Int, id)
            .input('idTratamento', sql.Int, t.idTratamento)
            .input('obs', sql.VarChar(100), t.obs)
            .input('qtd', sql.Int, t.qtd)
            .input('total', sql.Decimal, t.total)
            .input('id', sql.Int, t.id)
            .input('valor', sql.Decimal, t.valor)
            .query(
              id ? `
              UPDATE orc_tratamento
              SET valor = @valor, idOrcamento = @idOrcamento, idTratamento = @idTratamento, obs = @obs, qtd = @qtd, total = @total
              WHERE id = @id AND idOrcamento = ${id} AND idTratamento = ${t.id};              
              ` : `
              INSERT INTO orc_tratamento (valor, idOrcamento, idTratamento, obs, qtd, total)
              VALUES (@valor, @idOrcamento, @idTratamento, @obs, @qtd, @total)
              `
            )
          })
        )

      }
      await trans.commit();

      if (result.rowsAffected[0] === 1) {
        return { message: 'Atualizado com sucesso!' };
      } else {
        return { error: 'Nenhum registro atualizado' };
      }
      
    } catch (error) {
      throw new BadRequestException(`Erro ao atualizar orcamento: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const tratmentos = await this.budgetTreatmentService.findByBudgetId(id);
      
      if (tratmentos.length > 0) {
        Promise.all(
          tratmentos.map(async(t) => {
            await this.budgetTreatmentService.remove(t.id, id);
          })
        )
      }
      return {
        message: 'Orçamento deletado com sucesso!',
      }
    } catch (error) {
      throw new BadRequestException(`Erro ao deletar orcamento: ${error.message}`);
    }
  }
}
