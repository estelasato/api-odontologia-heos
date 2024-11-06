import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createPaymentMethodDto, CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { updatePaymentMethodDto, UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import * as sql from 'mssql';
import { PaymentTermsService } from '../payment-terms/payment-terms.service';
import { InstallmentsService } from '../installments/installments.service';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly installmentService: InstallmentsService,
  ) {}

  async create(data: createPaymentMethodDto) {
    const { descricao, status, idUser, typeUser } = data;
    const date = new Date();

    try {
      await this.sqlCon.request()
      .input('descricao', sql.VarChar(50), descricao)
      .input('status', sql.Int, 1)
      .input('dtCadastro', sql.DateTime, date)
      .input('idUser', sql.Int, idUser)
      .input('typeUser', sql.VarChar(10), typeUser)
      .input('dtUltAlt', sql.DateTime, date)
      .query`
        INSERT INTO formaPagamento (descricao, status, dtCadastro, dtUltAlt, idUser, typeUser)
        VALUES (@descricao, @status, @dtCadastro, @dtUltAlt, @idUser, @typeUser);
      `;

      return { message: 'Forma de pagamento criada com sucesso!' };
    } catch (error) {
      throw new Error(`Erro ao criar forma de pagamento: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.query('select * from formaPagamento');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Erro ao buscar forma de pagamento:  ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query(
        `select * from formaPagamento where id=${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('Forma de pagamento não encontrada');
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async update(id: number, data: updatePaymentMethodDto) {
    const { status, descricao, idUser, typeUser } = data;

    try {
      const date = new Date();
      const result = await this.sqlCon
        .request()
        .input('descricao', sql.VarChar(50), descricao)
        .input('id', sql.Int, id)
        .input('status', sql.Bit, status)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query`
        UPDATE formaPagamento 
        SET descricao = @descricao, status = @status, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
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
      const associate = await this.installmentService.findAll();

      const hasAssociate = associate.find((item) => item.idFormaPag === id);

      if (hasAssociate) {
        throw new BadRequestException('Não foi possível, forma de pagamento associada a uma parcela');
      }

      const result = await this.sqlCon
        .request()
        .query(
          `delete from formaPagamento where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        );
        
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Forma de pagamento não encontrada para exclusão');
      }
      return {
        message: 'Forma de pagamento excluída com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
}

