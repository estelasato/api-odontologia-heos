import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Exams } from './dto/ExamsDto';
import * as sql from 'mssql';

@Injectable()
export class ExamsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

  async create(data: Exams) {
    const { nome, descricao } = data;
    const date = new Date();
    try {
      const result = await this.sqlCon
        .request()
        .input('nome', sql.VarChar, nome)
        .input('descricao', sql.VarChar, descricao)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
        INSERT INTO exames (nome, descricao, dtCadastro, dtUltAlt)
        VALUES (@nome, @descricao, @dtCadastro, @dtUltAlt); 
        SELECT * FROM exames WHERE id = SCOPE_IDENTITY()
          `);

      const inserted = result.recordset[0];

      return { message: 'Exame criado com sucesso!', inserted };
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e}`);
    }
  }

  async findAll() {
    try {
      const r = await this.sqlCon.query(`SELECT * FROM exames`);
      if (r.recordset.length === 0) {
        return { message: 'Nenhum exame encontrado' };
      } else return r.recordset;
    } catch (e) {
      throw new BadRequestException(`Ocorreu um erro: ${e.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlCon.query(
        `
        SELECT * FROM exames WHERE id = ${id}
        `,
      );

      if (r.recordset.length > 0) {
        return r.recordset[0];
      } else {
        return { error: 'Exame não encontrado' };
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async update(id: number, data: Exams) {
    const { nome, descricao } = data;
    const date = new Date();

    
    try {
      const r = await this.sqlCon.request()
      .input('nome', sql.Varchar, nome)
      .input('descricao', sql.VarChar, descricao)
      .input('dtUltALt', sql.DateTime, date)
      .query(
        `UPDATE exames
        SET nome = @nome, descricao = @descricao, dtUltAlt = @dtUltAlt
        WHERE id = ${id};
        SELECT @@ROWCOUNT AS rowsAffected;
        `
      )
      if (r.rowsAffected[0] === 0) {
        throw new NotFoundException('Exame não encontrado');
      }

      return {
        message: 'Exame atualizado com sucesso!',
      };
    } catch(e) {
      throw new BadRequestException('Erro', e)
    }
  }

  async remove(id: number) {
    try {
      const r = await this.sqlCon
        .request()
        .query(`DELETE FROM exames WHERE id = ${id}`);
      if (r.recordset[0].rowsAffected === 0) {
        throw new BadRequestException('Erro ao remover exame');
      }

      return {
        message: 'Exame removido com sucesso!'
      }
    } catch (e) {
      throw new BadRequestException('Erro ao remover exame', e);
    }
  }
}
