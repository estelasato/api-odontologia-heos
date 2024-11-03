import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createProcedureDto,
  CreateProcedureDto,
} from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import * as sql from 'mssql';

@Injectable()
export class ProceduresService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: createProcedureDto) {
    try {
      const date = new Date();
      const { nome, descricao, valor, ativo, idUser, typeUser } = data;
      const request = this.sqlCon.request();
      const result = await request
        .input('nome', sql.VarChar(20), nome)
        .input('descricao', sql.VarChar(100), descricao)
        .input('valor', sql.Decimal, valor)
        .input('ativo', sql.Int, ativo)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
          INSERT INTO procedimentos (nome, descricao, valor, ativo, idUser, typeUser, dtCadastro, dtUltAlt)
          VALUES (@nome, @descricao, @valor, @ativo, @idUser, @typeUser, @dtCadastro, @dtUltAlt)
        `);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlCon.query(`
        SELECT * FROM procedimentos
        `);
      return result.recordset;
    } catch (e) {
      throw new Error(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = this.sqlCon.query(`
        SELECT * FROM procedimentos WHERE id = ${id}
     `);

     if (result.recordset?.length === 0) {
      throw new NotFoundException('Procedimento não encontrada');
    }
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(id: number, data: any) {
    try {
      const { nome, descricao, valor, ativo, idUser, typeUser } = data;
      const date = new Date();
      const result = await this.sqlCon
        .request()
        .input('nome', sql.VarChar(20), nome)
        .input('descricao', sql.VarChar(100), descricao)
        .input('valor', sql.Decimal, valor)
        .input('ativo', sql.Int, ativo)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date)
        .input('id', sql.Int, id).query(`
          UPDATE procedimentos
          SET nome = @nome, descricao = @descricao, valor = @valor, ativo = @ativo, idUser = @idUser, typeUser = @typeUser, dtUltAlt = @dtUltAlt
          WHERE id = @id;
          SELECT @@ROWCOUNT AS ROWS;
        `);
        if (result.rowsAffected[0] === 1) {
          return { message: 'Atualizado com sucesso!' };
        } else {
          return { error: 'Nenhum registro atualizado' };
        }

    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlCon.query(`
        DELETE FROM procedimentos WHERE id = ${id}
      `);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
