import { Inject, Injectable } from '@nestjs/common';
import { createServiceDto, CreateServiceDto } from './dto/create-service.dto';
import { updateServiceDto, UpdateServiceDto } from './dto/update-service.dto';
import * as sql from 'mssql';
import { AccReceivableService } from '../acc-receivable/acc-receivable.service';

@Injectable()
export class ServicesService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
    private readonly accReceivableService: AccReceivableService,
  ) {}

  async create(data: createServiceDto) {
    try {
      const date = new Date();
      const {
        idCondPagamento,
        idOrcamento,
        idPaciente,
        idUser,
        typeUser,
        valor,
        obs,
        status,
        contasReceber,
      } = data;
      const result = await this.sqlCon
        .request()
        .input('idCondPagamento', sql.Int, idCondPagamento)
        .input('idOrcamento', sql.Int, idOrcamento)
        .input('idPaciente', sql.Int, idPaciente)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar, typeUser)
        .input('valor', sql.Decimal, valor)
        .input('status', sql.VarChar, status)
        .input('obs', sql.VarChar, obs)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
        INSERT INTO servicos (idCondPagamento, idOrcamento, idPaciente, idUser, typeUser, valor, status, obs, dtCadastro, dtUltAlt)
        OUTPUT INSERTED.*
        VALUES (@idCondPagamento, @idOrcamento, @idPaciente, @idUser, @typeUser, @valor, @status, @obs, @dtCadastro, @dtUltAlt)
         SELECT * FROM funcionarios
        `);

      const serviceId = result.recordset[0].id;
      for (let c of contasReceber) {
        await this.accReceivableService.create({
          ...c,
          idPaciente,
          idServico: serviceId,
          idProfissional: c.idProfissional,
        });
      }

      return {
        message: 'Venda criada com sucesso.',
        data: result.recordset[0],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.request().query(`
        SELECT * FROM servicos
        `);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('Nenhuma venda encontrada.');
      }
      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlCon.request().input('id', sql.Int, id)
        .query(`
        SELECT * FROM servicos WHERE id = @id
        `);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('Nenhuma venda encontrada.');
      }
      const contasReceber = await this.accReceivableService.findAll({
        idServico: id,
      });
      result.recordset[0].contasReceber = contasReceber;
      console.log(contasReceber)
      return result.recordset[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async markAsConcluded(id: number) {
    try {
      const result = await this.sqlCon.request().input('id', sql.Int, id)
        .query(`
        UPDATE servicos SET status = 'CONCLUIDO' WHERE id = @id
        SELECT * FROM servicos WHERE id = @id
        `);

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('Falha ao concluir venda.');
      }
      return {
        message: 'serviço concluído',
        data: result.recordset[0],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, data: updateServiceDto) {
    try {
      const date = new Date();
      const {
        idCondPagamento,
        idOrcamento,
        idPaciente,
        idUser,
        typeUser,
        valor,
        obs,
        status,
        contasReceber,
      } = data;
      const result = await this.sqlCon
        .request()
        .input('id', sql.Int, id)
        .input('idCondPagamento', sql.Int, idCondPagamento)
        .input('idOrcamento', sql.Int, idOrcamento)
        .input('idPaciente', sql.Int, idPaciente)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar, typeUser)
        .input('valor', sql.Decimal, valor)
        .input('status', sql.VarChar, status)
        .input('obs', sql.VarChar, obs)
        .input('dtUltAlt', date).query(`
        UPDATE servicos SET idCondPagamento = @idCondPagamento, idOrcamento = @idOrcamento, idPaciente = @idPaciente, idUser = @idUser, typeUser = @typeUser, valor = @valor, status = @status, obs = @obs, dtUltAlt = @dtUltAlt
        WHERE id = @id
        SELECT * FROM servicos WHERE id = @id
        `);

      const listAcc = await this.accReceivableService.findAll({
        idServico: id,
        idPaciente: idPaciente,
        idProfissional: contasReceber[0].idProfissional,
      });

      if (listAcc.length > 0 || contasReceber.length > 0) {
        if (
          listAcc.length > 0 &&
          ((listAcc.length === contasReceber.length &&
            contasReceber.some((t) => !t.id)) ||
            listAcc.length !== contasReceber.length)
        ) {
          const ids = contasReceber?.map((t) => t.id && t.id);
          await Promise.all(
            listAcc?.map(async (t) => {
              if (t.id && !ids?.includes(t.id)) {
                // const orcTratamRequest = new sql.Request(trans);
                // orcTratamRequest
                await this.sqlCon.request().input('idContaRec', sql.Int, t.id)
                  .query(`
                    DELETE FROM contasReceber
                    WHERE id = @idContaRec AND idServico = @id;
                  `);
              }
            }),
          );
        }
        for (let c of contasReceber) {
          await this.accReceivableService.create({
            ...c,
            idPaciente,
            idServico: id,
            idProfissional: c.idProfissional,
            
          });
        }
      }

      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('Falha ao atualizar venda.');
      }
      return {
        message: 'Venda atualizada com sucesso.',
        data: result.recordset[0],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlCon.request().input('id', sql.Int, id)
        .query(`
        DELETE FROM servicos WHERE id = @id
        `);

      if (!result.rowsAffected || result.rowsAffected.length === 0) {
        throw new Error('Falha ao deletar venda.');
      }
      return {
        message: 'Venda deletada com sucesso.',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
