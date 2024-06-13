import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import * as sql from 'mssql';

@Injectable()
export class StateService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(createStateDto: CreateStateDto) {
    const { idPais, estado, uf, ativo } = createStateDto;
    const date = new Date();

    try {
      await this.sqlConnection
        .request()
        .input('idPais', sql.Int, idPais)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, ativo)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query`
        INSERT INTO estados (idPais, estado, uf, ativo, dtCadastro, dtUltAlt)
        VALUES (@idPais, @estado, @uf, @ativo, @dtCadastro, @dtUltAlt)
      `;
      return {
        message: 'Estado criado com sucesso!',
      };
    } catch (err) {
      return err;
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query(
        'SELECT * FROM estados',
      );

      const data = await Promise.all(result.recordset?.map(async (e) => {
        const country = await this.sqlConnection.query(
          `SELECT * FROM paises WHERE id = ${e.idPais}`,
        );


        if (country) {
          const c = country.recordset[0];
          return {...e, pais: { idPais: c.idPais, pais: c.pais } };
        } else return e
      }))
      return data;
    } catch (err) {
      return err;
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `SELECT * FROM estados WHERE id = ${id}`,
      );

      const country = await this.sqlConnection.query(
        `SELECT * FROM paises WHERE id = ${result.recordset[0].idPais}`,
      );

      const c = country.recordset[0];

      if (result.recordset.length > 0) {
        const state = result.recordset[0]; // Recupera o primeiro resultado (deve ser único)
        return { ...state, pais: { id: c.idPais, pais: c.pais } };
      } else {
        return { error: 'Estado não encontrado' }; // Se o estado não for encontrado
      }
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const { idPais, estado, uf, ativo } = updateStateDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
        .request()
        .input('idPais', sql.Int, idPais)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, ativo)
        .input('dtUltAlt', date).query(`
        UPDATE estados
        SET idPais = @idPais, estado = @estado, uf = @uf, ativo = @ativo, dtUltAlt = @dtUltAlt
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
      `);

      // Verifica se alguma linha foi atualizada
      if (updateResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('País não encontrado para atualização'); // Se nenhuma linha foi atualizada
      }

      return {
        message: 'Estado atualizado com sucesso!',
      };
    } catch (err) {
      return err;
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.sqlConnection
        .request()
        .query(
          `DELETE FROM estados WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        ); // Consulta para deletar pelo ID e verificar linhas afetadas

      // Verifica se alguma linha foi afetada
      if (deleteResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('estado não encontrado para exclusão'); // Se nenhuma linha foi deletada
      }

      return {
        message: 'estado excluído com sucesso',
      };
    } catch (err) {
      console.error('Erro ao excluir estado:', err); // Log para depuração
      throw new Error('Erro ao excluir estado'); // Lança um erro para ser tratado pelo chamador
    }
  }
}
