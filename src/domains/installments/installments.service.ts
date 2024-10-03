import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import * as sql from 'mssql';

@Injectable()
export class InstallmentsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: CreateInstallmentDto) {
    const { dias, idCondPag, idFormaPag, numParcela, perc, percTotatl } = data;
    const date = new Date();

    try {
      await this.sqlCon
        .request()
        .input('numParcela', sql.Int, numParcela)
        .input('dias', sql.Int, dias)
        .input('perc', sql.Decimal, perc)
        .input('percTotal', sql.Decimal, percTotatl)
        .input('status', sql.Int, 1)
        .input('idFormaPag', sql.Int, idFormaPag)
        .input('idCondPag', sql.Int, idCondPag)
        .input('dtCadastro', sql.DateTime, date)
        .input('dtUltAlt', sql.DateTime, date).query`
        INSERT INTO parcelas (numParcela, dias, perc, percTotal, status, idFormaPag, idCondPag, dtCadastro, dtUltAlt)
        VALUES (@numParcela, @dias, @perc, @percTotal, @status, @idFormaPag, @idCondPag, @dtCadastro, @dtUltAlt)  
      `;

      return { message: 'Parcela criada com sucesso!' };
    } catch (error) {
      throw new Error(`Erro ao criar parcela: ${error.message}`);
    }
  }

  // pega parcelas pela cond de pagamento
  async findByTerms(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from parcelas where idCondPag=${id}`,
      );

      return result.recordset;
    } catch {
      throw new Error('Erro ao buscar parcelas');
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.query('select * from parcelas');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar parcelas:  ${err.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} installment`;
  }

  async update(id: number, data: UpdateInstallmentDto) {
    const { dias, idCondPag, idFormaPag, numParcela, perc, percTotatl } = data;

    try {
      const date = new Date();
      const result = await this.sqlCon
        .input('id', sql.Int, id)
        .input('numParcela', sql.Int, numParcela)
        .input('dias', sql.Int, dias)
        .input('perc', sql.Decimal, perc)
        .input('percTotal', sql.Decimal, percTotatl)
        .input('status', sql.Int, 1)
        .input('idFormaPag', sql.Int, idFormaPag)
        .input('idCondPag', sql.Int, idCondPag)
        .input('dtCadastro', sql.DateTime, date)
        .input('dtUltAlt', sql.DateTime, date).query`
      UPDATE parcelas 
      SET numParcela = @numParcela, dias = @dias, perc = @perc, percTotal = @percTotal, status = @status, idFormaPag = @idFormaPag, idCondPag = @idCondPag, dtCadastro = @dtCadastro, dtUltAlt = @dtUltAlt
      WHERE id = @id;
    `;

      if (result.rowsAffected[0] === 1) {
        return { message: 'Atualizado com sucesso!' };
      } else {
        return { error: 'Nenhum registro atualizado' };
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlCon
        .input('id', sql.Int, id)
        .query`DELETE FROM parcelas WHERE id = @id`;

      if (result.rowsAffected[0] === 1) {
        return { message: 'Removido com sucesso!' };
      } else {
        return { error: 'Nenhum registro removido' };
      } 
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
}
