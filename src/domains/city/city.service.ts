import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import * as sql from 'mssql';

@Injectable()
export class CityService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const { idEstado, cidade, ddd, ativo} = createCityDto;
    const date = new Date();

    try {
      await this.sqlConnection
      .request()
      .input('idEstado', sql.Int, idEstado)
      .input('cidade', sql.VarChar(56), cidade)
      .input('ddd', sql.VarChar(2), ddd)
      .input('ativo', sql.Bit, ativo)
      .input('dtCadastro', date)
      .input('dtUltAlt', date)
      .query`
        INSERT INTO cidades (idEstado, cidade, ddd, ativo, dtCadastro, dtUltAlt)
        VALUES (@idEstado, @cidade, @ddd, @ativo, @dtCadastro, @dtUltAlt)
      `;

      return {
        message: 'Cidade criada com sucesso!'
      }
    } catch(err) {
      return err

    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query(
        'SELECT * FROM cidades',
      );

      const data = await Promise.all(result.recordset?.map(async (c) => {
        const state = await this.sqlConnection.query(
          `SELECT * FROM estados WHERE id = ${c.idEstado}`,
        );

        if (state) {
          const s = state.recordset[0];
          return {...c, estado: { id: s.idEstado, estado: s.estado } };
        } else return c
      }))
      return data;
    } catch(err) {
      return err
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `SELECT * FROM cidades WHERE id = ${id}`,
      );

      const state = await this.sqlConnection.query(
        `SELECT * FROM estados WHERE idEstado = ${result.recordset[0].idEstado}`,
      );
      const s = state.recordset[0];

      if (result.recordset.length > 0) {
        const city = result.recordset[0]; // Recupera o primeiro resultado (deve ser único)
        return { ...city, estado: { id: s.idEstado, estado: s.estado } };
      } else {
        return { error: 'Estado não encontrado' }; // Se o estado não for encontrado
      }
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }
  // throw new NotFoundException('Cidade não encontrado');

  async update(id: number, updateCityDto: UpdateCityDto) {
    const { idEstado, cidade, ddd, ativo} = updateCityDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
      .request()
      .input('idEstado', sql.Int, idEstado)
      .input('cidade', sql.VarChar(56), cidade)
      .input('ddd', sql.VarChar(2), ddd)
      .input('ativo', sql.Bit, ativo)
      .input('dtUltAlt', date)
      .query`
        UPDATE cidades
        SET idEstado = @idEstado, cidade = @cidade, ddd = @ddd, ativo = @ativo, dtUltAlt = @dtUltAlt
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
      `;

      if (updateResult.rowsAffected[0] === 0) {
        throw new NotFoundException('Cidade não encontrada');
      }

      return {
        message: 'Cidade atualizada com sucesso!'
      }
    } catch(err) {
      return err
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.sqlConnection
        .request()
        .query(
          `DELETE FROM cidades WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        ); // Consulta para deletar pelo ID e verificar linhas afetadas

      // Verifica se alguma linha foi afetada
      if (deleteResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('cidade não encontrada para exclusão'); // Se nenhuma linha foi deletada
      }

      return {
        message: 'cidade excluída com sucesso',
      };
    } catch (err) {
      console.error('Erro ao excluir cidade:', err); // Log para depuração
      throw new Error('Erro ao excluir cidade'); // Lança um erro para ser tratado pelo chamador
    }
  }
}
