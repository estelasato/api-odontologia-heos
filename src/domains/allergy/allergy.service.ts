import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';
import * as sql from 'mssql';

@Injectable()
export class AllergyService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(data: BasicFormDto): Promise<any> {
    const { nome, descricao, ativo, idUser, typeUser } = data;

    try {
      const now = new Date();
      await this.sqlConnection
        .request()
        .input('nome', sql.VarChar, nome)
        .input('descricao', sql.VarChar, descricao)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', sql.DateTime, now)
        .input('idUser', sql.Int, data.idUser)
        .input('typeUser', sql.VarChar, typeUser)
        .input('dtUltAlt', sql.DateTime, now).query`
          INSERT INTO alergias (nome, descricao, ativo, dtCadastro, dtUltAlt, idUser, typeUser)
          VALUES (@nome, @descricao, @ativo, @dtCadastro, @dtUltAlt, @idUser, @typeUser);
        `;
      return {
        message: 'Criado com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('select * from alergias');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `select * from alergias where id=${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('Alergia não encontrada');
      }
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }

  async update(id: number, data: BasicFormDto) {
    const { nome, descricao, ativo, idUser, typeUser } = data;

    try {
      const now = new Date();
      const result = await this.sqlConnection
        .request()
        .input('id', sql.Int, id)
        .input('nome', sql.VarChar(20), nome)
        .input('descricao', sql.VarChar(100), descricao)
        .input('ativo', sql.Bit, ativo)
        .input('idUser', sql.Int, data.idUser)
        .input('typeUser', sql.VarChar, typeUser)
        .input('dtUltAlt', sql.DateTime, now).query`
        UPDATE alergias 
        SET nome=@nome, descricao=@descricao, ativo=@ativo, dtUltAlt=@dtUltAlt, idUser=@idUser, typeUser=@typeUser
        WHERE id=@id; SELECT @@ROWCOUNT AS ROWS;
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
      const result = await this.sqlConnection
        .request()
        .query(
          `delete from alergias where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        );
      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('alergia não encontrada para exclusão');
      }
      return {
        message: 'alergia excluída com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um erro:  ${err.message}`);
    }
  }
}
