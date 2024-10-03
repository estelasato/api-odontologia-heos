import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createPaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import * as sql from 'mssql';

@Injectable()
export class PaymentTermsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: createPaymentTermDto) {
    const { descricao,status, desconto, dias, idFormaPag, juros,multa,numParcela,perc, total } = data;
    const date = new Date();

    try {
      await this.sqlCon.request()
      .input('descricao', sql.VarChar(50), descricao)
      .input('status', sql.Int, status)
      .input('juros', sql.Float, juros)
      .input('multa', sql.Float, multa)
      .input('desconto', sql.Float, desconto)
      .input('numParcela', sql.Int, numParcela)
      .input('dias', sql.Int, dias)
      .input('perc', sql.Float, perc)
      .input('total', sql.Float, total)
      .input('idFormaPag', sql.Int, idFormaPag)
      .input('dtCadastro', sql.DateTime, date)
      .input('dtUltAlt', sql.DateTime, date)
      .query`
        INSERT INTO condPagamento (descricao, status, dtCadastro, dtUltAlt, juros, multa, desconto, numParcela, dias, perc, total, idFormaPag)
        VALUES (@descricao, @status, @dtCadastro, @dtUltAlt, @juros, @multa, @desconto, @numParcela, @dias, @perc, @total, @idFormaPag)
      `;
      return { message: 'Condição de pagamento criada com sucesso!' };
    } catch (error) {
      throw new Error(`Erro ao criar condição de pagamento: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.query('select * from condPagamento');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar condição de pagamento:  ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from condPagamento where id=${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('Condição de pagamento não encontrada');
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async update(id: number, data: UpdatePaymentTermDto) {
    const { status, descricao, desconto } = data;

    try {
      const date = new Date();
      const result = await this.sqlCon
        .request()
        .input('descricao', sql.VarChar(50), descricao)
        .input('id', sql.Int, id)
        .input('status', sql.Int, status)
        .input('desconto', sql.Float, desconto)
        .input('dtUltAlt', sql.DateTime, date).query`
        UPDATE condPagamento 
        SET descricao = @descricao, status = @status, desconto = @desconto, dtUltAlt = @dtUltAlt
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
        .request()
        .query(
          `delete from condPagamento where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        );
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Condição de pagamento não encontrada para exclusão');
      }
      return {
        message: 'Condição de pagamento excluída com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
}

