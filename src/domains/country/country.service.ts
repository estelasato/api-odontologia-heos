import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import * as sql from 'mssql';

@Injectable()
export class CountryService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const { pais, ddi, sigla, ativo } = createCountryDto;
    const now = new Date();

    try {
      await this.sqlConnection
        .request()
        .input('pais', sql.VarChar(56), pais)
        .input('ddi', sql.VarChar(3), ddi)
        .input('sigla', sql.VarChar(3), sigla)
        .input('ativo', sql.Bit, ativo)
        .input('dtCadastro', sql.DateTime, now)
        .input('dtUltAlt', sql.DateTime, now).query`
        INSERT INTO paises (pais, ddi, sigla, ativo, dtCadastro, dtUltAlt)
        VALUES (@pais, @ddi, @sigla, @ativo, @dtCadastro, @dtUltAlt)
      `;
      return {
        message: 'Criado com sucesso!',
      };
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('SELECT * FROM paises');
      return result.recordset; // Retorna os resultados da consulta
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.sqlConnection.query(
        `SELECT * FROM paises WHERE id = ${id}`,
      );

      if (result.recordset.length === 0) {
        throw new NotFoundException('País não encontrado'); // Lança exceção se não encontrar
      }
      return result.recordset[0];
    } catch (err) {
      return err; // Retorna o erro, caso ocorra
    }
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const { pais, ddi, sigla, ativo } = updateCountryDto;
    const now = new Date(); // Data de última alteração
    console.log(id, updateCountryDto)
    try {
      const updateResult = await this.sqlConnection
        .request() // Cria uma nova requisição
        .input('id', sql.Int, id) // Adiciona o parâmetro do ID
        .input('pais', sql.VarChar(56), pais) // Adiciona os valores atualizados
        .input('ddi', sql.VarChar(3), ddi)
        .input('sigla', sql.VarChar(3), sigla)
        .input('ativo', sql.BIT, ativo)
        .input('dtUltAlt', sql.DateTime, now) // Data da última alteração
        .query(
          `UPDATE paises 
           SET pais = @pais, ddi = @ddi, sigla = @sigla, ativo = @ativo, dtUltAlt = @dtUltAlt 
           WHERE id = @id; SELECT @@ROWCOUNT AS rowsAffected`, // Verificar se a atualização foi bem-sucedida
        );

      // Verifica se alguma linha foi atualizada
      if (updateResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('País não encontrado para atualização' + id); // Se nenhuma linha foi atualizada
      }

      return {
        message: 'País atualizado com sucesso',
      };
    } catch (err) {
      console.error('Erro ao atualizar país:', err); // Log para depuração
      throw new Error('Erro ao atualizar país'); // Lança um erro para ser tratado pelo chamador
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.sqlConnection
        .request()
        .query(
          `DELETE FROM paises WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`,
        ); // Consulta para deletar pelo ID e verificar linhas afetadas

      // Verifica se alguma linha foi afetada
      if (deleteResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('País não encontrado para exclusão'); // Se nenhuma linha foi deletada
      }

      return {
        message: 'País excluído com sucesso',
      };
    } catch (err) {
      console.error('Erro ao excluir país:', err); // Log para depuração
      throw new Error('Erro ao excluir país'); // Lança um erro para ser tratado pelo chamador
    }
  }
}
