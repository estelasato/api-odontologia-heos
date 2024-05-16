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
    const { estado_ID, cidade, ddd, ativo} = createCityDto;
    const date = new Date();

    try {
      await this.sqlConnection
      .request()
      .input('estado_ID', sql.Int, estado_ID)
      .input('cidade', sql.VarChar(56), cidade)
      .input('ddd', sql.VarChar(2), ddd)
      .input('ativo', sql.Bit, ativo)
      .input('data_cadastro', date)
      .input('data_ult_alt', date)
      .query`
        INSERT INTO cidades (estado_ID, cidade, ddd, ativo, data_cadastro, data_ult_alt)
        VALUES (@estado_ID, @cidade, @ddd, @ativo, @data_cadastro, @data_ult_alt)
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
          `SELECT * FROM estados WHERE estado_ID = ${c.estado_ID}`,
        );

        if (state) {
          const s = state.recordset[0];
          return {...c, estado: { estado_ID: s.estado_ID, estado: s.estado } };
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
        `SELECT * FROM cidades WHERE cidade_ID = ${id}`,
      );

      const state = await this.sqlConnection.query(
        `SELECT * FROM estados WHERE estado_ID = ${result.recordset[0].estado_ID}`,
      );
      const s = state.recordset[0];

      if (result.recordset.length > 0) {
        const city = result.recordset[0]; // Recupera o primeiro resultado (deve ser único)
        return { ...city, estado: { estado_ID: s.estado_ID, estado: s.estado } };
      } else {
        return { error: 'Estado não encontrado' }; // Se o estado não for encontrado
      }
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }
  // throw new NotFoundException('Cidade não encontrado');

  async update(id: number, updateCityDto: UpdateCityDto) {
    const { estado_ID, cidade, ddd, ativo} = updateCityDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
      .request()
      .input('estado_ID', sql.Int, estado_ID)
      .input('cidade', sql.VarChar(56), cidade)
      .input('ddd', sql.VarChar(2), ddd)
      .input('ativo', sql.Bit, ativo)
      .input('data_ult_alt', date)
      .query`
        UPDATE cidades
        SET estado_ID = @estado_ID, cidade = @cidade, ddd = @ddd, ativo = @ativo, data_ult_alt = @data_ult_alt
        WHERE cidade_ID = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
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
          `DELETE FROM cidades WHERE cidade_ID = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
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
