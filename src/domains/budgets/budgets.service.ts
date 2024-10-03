import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { budgetFilter, createBudgetDto, CreateBudgetDto } from './dto/create-budget.dto';
import { updateBudgetDto, UpdateBudgetDto } from './dto/update-budget.dto';
import * as sql from 'mssql';


@Injectable()
export class BudgetsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: createBudgetDto) {
    const { idAnamnese,idPaciente, idProfissional,idCondPagamento, total,status } = data;
    const date = new Date();

    try {
      await this.sqlCon.request()
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
        VALUES (@idAnamnese, @idPaciente, @idProfissional, @idCondPagamento, @total, @status, @dtCadastro
      `;

      return { message: 'Criado com sucesso!' };
    } catch (error) {
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

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: updateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
