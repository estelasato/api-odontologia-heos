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
    const { pais_ID, estado, uf, ativo } = createStateDto;
    const date = new Date();

    try {
      await this.sqlConnection
        .request()
        .input('pais_ID', sql.Int, pais_ID)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, ativo)
        .input('data_cadastro', date)
        .input('data_ult_alt', date).query`
        INSERT INTO estados (pais_ID, estado, uf, ativo, data_cadastro, data_ult_alt)
        VALUES (@pais_ID, @estado, @uf, @ativo, @data_cadastro, @data_ult_alt)
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
          `SELECT * FROM paises WHERE pais_ID = ${e.pais_ID}`,
        );

        if (country) {
          const c = country.recordset[0];
          return {...e, pais: { pais_ID: c.pais_ID, pais: c.pais } };
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
        `SELECT * FROM estados WHERE estado_ID = ${id}`,
      );

      const country = await this.sqlConnection.query(
        `SELECT * FROM paises WHERE pais_ID = ${result.recordset[0].pais_ID}`,
      );

      const c = country.recordset[0];

      if (result.recordset.length > 0) {
        const estado = result.recordset[0]; // Recupera o primeiro resultado (deve ser único)
        return { ...estado, pais: { pais_ID: c.pais_ID, pais: c.pais } };
      } else {
        return { error: 'Estado não encontrado' }; // Se o estado não for encontrado
      }

      // if (result.recordset.length === 0) {
      //   throw new NotFoundException('Estado não encontrado'); // Lança exceção se não encontrar
      // }

      // return result.recordset[0];
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const { pais_ID, estado, uf, ativo } = updateStateDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
        .request()
        .input('pais_ID', sql.Int, pais_ID)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, ativo)
        .input('data_ult_alt', date).query(`
        UPDATE estados
        SET pais_ID = @pais_ID, estado = @estado, uf = @uf, ativo = @ativo, data_ult_alt = @data_ult_alt
        WHERE estado_ID = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
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
          `DELETE FROM estados WHERE estado_ID = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
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
