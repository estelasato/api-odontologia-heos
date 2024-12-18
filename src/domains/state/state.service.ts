import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { State } from './dto/state.dto';
import * as sql from 'mssql';

@Injectable()
export class StateService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(createStateDto: State) {
    const { idPais, estado, uf, ativo, idUser, typeUser } = createStateDto;
    const date = new Date();

    try {
      await this.sqlConnection
        .request()
        .input('idPais', sql.Int, idPais)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query`
        INSERT INTO estados (idPais, estado, uf, ativo, dtCadastro, dtUltAlt, idUser, typeUser)
        VALUES (@idPais, @estado, @uf, @ativo, @dtCadastro, @dtUltAlt, @idUser, @typeUser)
      `;
      return {
        message: 'Estado criado com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findAll(filter?: { codPais?: number }) {
    try {
      let clause = ''
      if (filter?.codPais) {
        clause = `WHERE idPais = ${filter.codPais}`
      }

      const result = await this.sqlConnection.query(
        `SELECT * FROM estados ${clause}`,
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
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
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
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);; // Retorna o erro, caso ocorra
    }
  }

  async update(id: number, updateStateDto: State) {
    const { idPais, estado, uf, ativo, idUser, typeUser } = updateStateDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
        .request()
        .input('idPais', sql.Int, idPais)
        .input('estado', sql.VarChar(56), estado)
        .input('uf', sql.VarChar(2), uf)
        .input('ativo', sql.Bit, ativo)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query(`
        UPDATE estados
        SET idPais = @idPais, estado = @estado, uf = @uf, ativo = @ativo, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
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
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
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
