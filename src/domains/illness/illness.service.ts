import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as sql from 'mssql';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Injectable()
export class IllnessService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(data: BasicFormDto): Promise<any> {
    const { nome, descricao, ativo } = data;

    try {
      const now = new Date();
      const result = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar, nome)
        .input('descricao', sql.VarChar, descricao)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', sql.DateTime, now)
        .input('dtUltAlt', sql.DateTime, now)
        .query`
          INSERT INTO doencas (nome, descricao, ativo, dtCadastro, dtUltAlt)
          VALUES (@nome, @descricao, @ativo, @dtCadastro, @dtUltAlt)
        `;
      return {
        message: 'Criado com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('select * from doencas');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `select * from doencas where id=${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('Doença não encontrada');
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async update(id: number, data: BasicFormDto) {
    const { nome, descricao, ativo } = data;
    
    try {
      const now = new Date();
      const result = await this.sqlConnection
        .request()
        .input('id', sql.Int, id)
        .input('nome', sql.VarChar(20), nome)
        .input('descricao', sql.VarChar(100), descricao)
        .input('ativo', sql.Bit, ativo)
        .input('dtUltAlt', sql.DateTime, now)
        .query`
        UPDATE doencas 
        SET nome=@nome, descricao=@descricao, ativo=@ativo, dtUltAlt=@dtUltAlt 
        WHERE id=@id; SELECT @@ROWCOUNT AS ROWS;
      `;

      if (result.rowsAffected[0] === 1) {
        return { message: 'Atualizado com sucesso!' };
      } else {
        return { error: 'Nenhum registro atualizado' };
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlConnection
      .request()
      .query(
        `delete from doencas where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
      );

      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Item não encontrado para exclusão');
      }
      return {
        message: 'Item excluído com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }
}
