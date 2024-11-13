import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { City } from './dto/city.dto';
import * as sql from 'mssql';

@Injectable()
export class CityService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ) {}

  async create(createCityDto: City) {
    const { idEstado, cidade, ddd, ativo, idUser, typeUser } = createCityDto;
    const date = new Date();

    try {
      await this.sqlConnection
        .request()
        .input('idEstado', sql.Int, idEstado)
        .input('cidade', sql.VarChar(56), cidade)
        .input('ddd', sql.VarChar(5), ddd)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query`
        INSERT INTO cidades (idEstado, cidade, ddd, ativo, dtCadastro, dtUltAlt, idUser, typeUser)
        VALUES (@idEstado, @cidade, @ddd, @ativo, @dtCadastro, @dtUltAlt, @idUser, @typeUser)
      `;

      return {
        message: 'Cidade criada com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('SELECT * FROM cidades');

      const data = await Promise.all(
        result.recordset?.map(async (c) => {
          const state = await this.sqlConnection.query(
            `SELECT * FROM estados WHERE id = ${c.idEstado}`,
          );

          if (state) {
            const s = state.recordset[0];
            return { ...c, estado: { id: s.idEstado, estado: s.estado } };
          } else return c;
        }),
      );
      return data;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findCEP(idCity: number) {
    try {
      const result = await this.sqlConnection.query(`
      SELECT cidades.cidade AS cidade, estados.uf AS uf, paises.pais AS pais
      FROM cidades
      JOIN estados ON cidades.idEstado = estados.id
      JOIN paises ON estados.idPais = paises.id
      WHERE cidades.id = ${idCity}
      `);
      return result.recordset[0];
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);;
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `
        SELECT cidades.*, estados.uf AS uf, paises.pais AS pais
        FROM cidades
        JOIN estados ON cidades.idEstado = estados.id
        JOIN paises ON estados.idPais = paises.id
        WHERE cidades.id = ${id}
        `,
      );

      if (r.recordset.length > 0) { 
        return r.recordset[0];
      } else {
        return new NotFoundException(`Não encontrado`)
      }

    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);; 
    }
  }


  async update(id: number, updateCityDto: City) {
    const { idEstado, cidade, ddd, ativo, idUser, typeUser } = updateCityDto;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
        .request()
        .input('idEstado', sql.Int, idEstado)
        .input('cidade', sql.VarChar(56), cidade)
        .input('ddd', sql.VarChar(3), ddd)
        .input('ativo', sql.Bit, ativo)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', date).query`
        UPDATE cidades
        SET idEstado = @idEstado, cidade = @cidade, ddd = @ddd, ativo = @ativo, dtUltAlt = @dtUltAlt, idUser = @idUser, typeUser = @typeUser
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
      `;

      if (updateResult.rowsAffected[0] === 0) {
        throw new NotFoundException('Cidade não encontrada');
      }

      return {
        message: 'Cidade atualizada com sucesso!',
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
