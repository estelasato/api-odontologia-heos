import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';
import * as sql from 'mssql';
import { InstallmentsService } from '../installments/installments.service';

@Injectable()
export class PaymentTermsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly installmentService: InstallmentsService,
  ) {}

  async create(data: createPaymentTermDto) {
    const transaction = new sql.Transaction(this.sqlCon);
    const { descricao, status, desconto, parcelas } = data;
    const date = new Date();

    try {
      await transaction.begin();
      const condPagamentoRequest = new sql.Request(transaction);

      const result = await condPagamentoRequest
        .input('descricao', sql.VarChar(50), descricao)
        .input('status', sql.Int, status)
        .input('desconto', sql.Float, desconto)
        .input('dtCadastro', sql.DateTime, date)
        .input('dtUltAlt', sql.DateTime, date).query`
        INSERT INTO condPagamento (descricao, status, desconto, dtCadastro, dtUltAlt)
        OUTPUT INSERTED.id
        VALUES (@descricao, @status, @desconto, @dtCadastro, @dtUltAlt)
      `;
      const condPagamentoId = result.recordset[0].id;

      for (let parcela of parcelas) {
        const parcelaRequest = new sql.Request(transaction);
        await parcelaRequest
          .input('idCondPag', sql.Int, condPagamentoId)
          .input('numParcela', sql.Int, parcela.numParcela)
          .input('dias', sql.Int, parcela.dias)
          .input('perc', sql.Float, parcela.perc)
          .input('idFormaPag', sql.Int, parcela.idFormaPag)
          .input('dtCadastro', sql.DateTime, date)
          .input('dtUltAlt', sql.DateTime, date).query(`
            INSERT INTO parcelas (idCondPag, numParcela, dias, perc, idFormaPag, dtCadastro, dtUltAlt)
            VALUES (@idCondPag, @numParcela, @dias, @perc, @idFormaPag, @dtCadastro, @dtUltAlt)
          `);
      }

      await transaction.commit();
      return { message: 'Condição de pagamento criada com sucesso!' };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Erro ao criar condição de pagamento: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.query('select * from condPagamento');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(
        `Erro ao buscar condição de pagamento:  ${err.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from condPagamento where id=${id}`,
      );

      const installments = await this.installmentService.findByTerms(id);

      result.recordset[0].parcelas = installments;
      if (result.recordset.length === 0) {
        throw new NotFoundException('Condição de pagamento não encontrada');
      }
      console.log(result.recordset[0]);
      return result.recordset[0];
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async update(id: number, data: UpdatePaymentTermDto) {
    const trans = new sql.Transaction(this.sqlCon);
    const { status, descricao, desconto, parcelas } = data;

    try {
      await trans.begin();

      const tableRequest = new sql.Request(trans);
      const date = new Date();
      const result = await tableRequest
        .input('descricao', sql.VarChar(50), descricao)
        .input('id', sql.Int, id)
        .input('status', sql.Int, status)
        .input('desconto', sql.Float, desconto)
        .input('dtUltAlt', sql.DateTime, date).query`
        UPDATE condPagamento 
        SET descricao = @descricao, status = @status, desconto = @desconto, dtUltAlt = @dtUltAlt
        WHERE id = @id;
      `;

      const listaParcelas = await this.installmentService.findByTerms(id);

      // se tiver dados nmas duas listas
      // se a lista antiga n for vazia e
      // se as listas sao do msm tamanho e falta algum id (criacao/edicao) ou
      // se n forem de mesmo tamanho
      if (listaParcelas.length > 0 || parcelas.length > 0) {
        if (
          listaParcelas.length > 0 &&
          ((listaParcelas.length === parcelas.length &&
            parcelas.some((p) => !p.id)) ||
            listaParcelas.length != parcelas.length)
        ) {
          // ids das parcelas atuais
          const ids = parcelas?.map((p) => p.id);
          await Promise.all(
            listaParcelas?.map(async (p) => {
              // se no banco tem alguma parcela q n esta mais na lista atual, remova
              if (p.id && !ids.includes(p.id)) {
                await tableRequest
                  .input('id', sql.Int, p.id)
                  .query(
                    `delete from parcelas where id = @id AND idCondPag = ${id}`,
                  );
              }
            }),
          );
        }

        await Promise.all(
          parcelas?.map(async (p) => {
            if (!p.id) {
            await tableRequest
              // .input('id', sql.Int, p.id)
              .input('idCondPag', sql.Int, id)
              .input('numParcela', sql.Int, p.numParcela)
              .input('dias', sql.Int, p.dias)
              .input('perc', sql.Float, p.perc)
              .input('status', sql.Int, 1)
              .input('idFormaPag', sql.Int, p.idFormaPag)
              .input('dtUltAlt', sql.DateTime, date)
              .input('dtCadastro', sql.DateTime, date)
              .query(
              //   id
              //     ? `
              //   update parcelas
              //   set numParcela = @numParcela, dias = @dias, perc = @perc, idFormaPag = @idFormaPag, status = @status, dtUltAlt = @dtUltAlt
              //   where id = @id AND idCondPag = ${id}
              //  `
              //     : 
                  `
                insert into parcelas (idCondPag, numParcela, dias, perc, idFormaPag, status, dtCadastro, dtUltAlt)
                values (@idCondPag, @numParcela, @dias, @perc, @idFormaPag, @status, @dtCadastro, @dtUltAlt)
            `,
              );
          }}),
        );
      }
      await trans.commit();

      if (result.rowsAffected[0] === 1) {
        return { message: 'Atualizado com sucesso!' };
      } else {
        return { error: 'Nenhum registro atualizado' };
      }
    } catch (err) {
      await trans.rollback();
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async remove(id: number) {
    try {
      const parcelas = await this.installmentService.findByTerms(id);
      if (parcelas.length > 0) {
        throw new BadRequestException(
          'Condição de pagamento possui parcelas vinculadas',
        );
      }
      const result = await this.sqlCon
        .request()
        .query(
          `delete from condPagamento where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        );
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException(
          'Condição de pagamento não encontrada para exclusão',
        );
      }
      return {
        message: 'Condição de pagamento excluída com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
}
