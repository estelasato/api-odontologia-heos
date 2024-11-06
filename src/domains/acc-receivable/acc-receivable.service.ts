import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createAccReceivableDto,
  CreateAccReceivableDto,
  filterAccReceivableDto,
} from './dto/create-acc-receivable.dto';
import {
  updateAccReceivableDto,
  UpdateAccReceivableDto,
} from './dto/update-acc-receivable.dto';
import * as sql from 'mssql';
import { ServicesService } from '../services/services.service';

@Injectable()
export class AccReceivableService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: createAccReceivableDto, transaction?: sql.Transaction) {
    const {
      dtVencimento,
      idFormaPag,
      idServico,
      idPaciente,
      idProfissional,
      parcela,
      valorParcela,
      desconto,
      dtCancelamento,
      dtRecebimento,
      juros,
      multa,
      obs,
      situacao,
      // valorRecebido,
      idUser,
      typeUser,
    } = data;
    const date = new Date();
    try {
      const request = transaction
        ? new sql.Request(transaction)
        : this.sqlCon.request();
      const result = await request
        .input('idPaciente', sql.Int, idPaciente)
        .input('idServico', sql.Int, idServico)
        .input('idFormaPag', sql.Int, idFormaPag)
        .input('idProfissional', sql.Int, idProfissional)
        .input('obs', sql.VarChar, obs)
        .input('parcela', sql.Int, parcela)
        .input('desconto', sql.Decimal, desconto)
        .input('multa', sql.Decimal, multa)
        .input('juros', sql.Decimal, juros)
        .input('valorParcela', sql.Decimal, valorParcela)
        // .input('valorRecebido', sql.Decimal, valorRecebido)
        .input('situacao', sql.VarChar, situacao)
        .input('dtVencimento', sql.DateTime, dtVencimento)
        .input('dtRecebimento', sql.DateTime, dtRecebimento)
        .input('dtCancelamento', sql.DateTime, dtCancelamento)
        .input('dtCadastro', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query(`
          INSERT INTO contasReceber (idPaciente, idServico, idFormaPag, idProfissional, obs, parcela, desconto, multa, juros, valorParcela, situacao, dtVencimento, dtRecebimento, dtCancelamento, dtCadastro, dtUltAlt, idUser, typeUser)
          OUTPUT INSERTED.*
          VALUES (@idPaciente, @idServico, @idFormaPag, @idProfissional, @obs, @parcela, @desconto, @multa, @juros, @valorParcela, @situacao, @dtVencimento, @dtRecebimento, @dtCancelamento, @dtCadastro, @dtUltAlt, @idUser, @typeUser)
        `);
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findAll(filter?: filterAccReceivableDto) {
    const {
      dtCancelamento,
      dtRecebimento,
      dtVencimento,
      idFormaPag,
      idServico,
      idPaciente,
      idProfissional,
      situacao,
    } = filter;

    let clause = [];
    if (dtCancelamento) clause.push(`dtCancelamento = ${dtCancelamento}`);
    if (dtRecebimento) clause.push(`dtRecebimento = ${dtRecebimento}`);
    if (dtVencimento) clause.push(`dtVencimento = ${dtVencimento}`);
    if (idFormaPag) clause.push(`idFormaPag = ${idFormaPag}`);
    if (idServico) clause.push(`idServico = ${idServico}`);
    if (idPaciente) clause.push(`idPaciente = ${idPaciente}`);
    if (idProfissional) clause.push(`idProfissional = ${idProfissional}`);
    if (situacao) clause.push(`situacao = ${situacao}`);
    const filters = clause.length > 0 ? `WHERE ${clause.join(' AND ')}` : '';

    try {
      const result = await this.sqlCon.query(`
          SELECT contasReceber.*, pacientes.nome as nomePaciente, profissionais.nome as nomeProfissional 
          FROM contasReceber
          JOIN pacientes ON contasReceber.idPaciente = pacientes.id
          JOIN profissionais ON contasReceber.idProfissional = profissionais.id
           ${filters}
        `);
      return result.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async markAsPaid(id: number, idUser: number, typeUser: string) {
    try {
      const date = new Date();
      const result = await this.sqlCon
        .request()
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtRecebimento', sql.DateTime, date)
        .input('id', sql.Int, id).query(`
          UPDATE contasReceber
          SET situacao = 'PAGO', dtRecebimento = @dtRecebimento, idUser = @idUser, typeUser = @typeUser
          OUTPUT inserted.*
          WHERE id = @id
        `);

      const serviceUpdated = result.recordset[0];

      if (result.rowsAffected[0] === 0) {
        throw new NotFoundException('Não encontrado');
      }

      const accounts = await this.findAll({ idServico: serviceUpdated.idServico });

      const allPaid = accounts?.every((account) => account.situacao == 'PAGO');
      if (allPaid) {
        try {
          const r = await this.sqlCon
            .request()
            .input('idUser', sql.Int, idUser)
            .input('typeUser', sql.VarChar(10), typeUser)
            .input('dtUltAlt', sql.DateTime, date)
            .input('idServico', sql.Int, serviceUpdated.idServico).query(`
              UPDATE servicos
              SET status = 'CONCLUIDO', dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
              WHERE id = @idServico
            `);
            
        } catch(e) {
          console.log(e)
        }
      }
      // verificar se todas estao pagas e mudar status do servico
      // ao pagar uma conta a receber atualizar no orc_servico
      return {
        message: 'Atualizado com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.query`
        SELECT * FROM contasReceber WHERE id = ${id}
      `;

      if (result.recordset.length === 0) {
        return result.recordset[0];
      } else {
        throw new NotFoundException(`Não encontrado`);
      }
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }

  async update(id: number, data: updateAccReceivableDto) {
    const {
      dtVencimento,
      idFormaPag,
      idServico,
      idPaciente,
      idProfissional,
      parcela,
      valorParcela,
      desconto,
      dtCancelamento,
      dtRecebimento,
      juros,
      multa,
      obs,
      situacao,
      valorRecebido,
      idUser,
      typeUser,
    } = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('idPaciente', sql.Int, idPaciente)
        .input('idServico', sql.Int, idServico)
        .input('idFormaPag', sql.Int, idFormaPag)
        .input('idProfissional', sql.Int, idProfissional)
        .input('obs', sql.VarChar, obs)
        .input('parcela', sql.Int, parcela)
        .input('desconto', sql.Decimal, desconto)
        .input('multa', sql.Decimal, multa)
        .input('juros', sql.Decimal, juros)
        .input('valorParcela', sql.Decimal, valorParcela)
        .input('valorRecebido', sql.Decimal, valorRecebido)
        .input('situacao', sql.VarChar, situacao)
        .input('dtVencimento', sql.DateTime, dtVencimento)
        .input('dtRecebimento', sql.DateTime, dtRecebimento)
        .input('dtCancelamento', sql.DateTime, dtCancelamento)
        .input('id', sql.Int, id)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query(`
        UPDATE contasReceber
        SET idPaciente = @idPaciente, idServico = @idServico, idFormaPag = @idFormaPag, idProfissional = @idProfissional, obs = @obs, parcela = @parcela, desconto = @desconto, multa = @multa, juros = @juros, valorParcela = @valorParcela, valorRecebido = @valorRecebido, situacao = @situacao, dtVencimento = @dtVencimento, dtRecebimento = @dtRecebimento, dtCancelamento = @dtCancelamento, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
        WHERE id = @id
      `);

      if (result.rowsAffected[0] === 0) {
        throw new NotFoundException('Não encontrado');
      }

      return {
        message: 'Atualizado com sucesso!',
      };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlCon.query`
        DELETE FROM contasReceber WHERE id = ${id}
      `;

      if (result.rowsAffected[0] === 0) {
        throw new NotFoundException('Não encontrado');
      }

      return {
        message: 'Removido com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro: ${err.message}`);
    }
  }
}
