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
      const result = await this.sqlConnection.query('SELECT * FROM cidades');
      return result.recordset;
    } catch(err) {
      return err
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `SELECT * FROM cidades WHERE cidade_ID = ${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('Cidade não encontrado'); // Lança exceção se não encontrar
      }
      return result.recordset[0];
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

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
        throw new NotFoundException('estado não encontrado para exclusão'); // Se nenhuma linha foi deletada
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
