import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Responsible } from './dto/responsible-party.dto';
import * as sql from 'mssql';
import { CityService } from '../city/city.service';

@Injectable()
export class ResponsiblePartyService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cityService: CityService
  ) {}

  async create(data: Responsible) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil,
      cep, bairro, complemento, idCidade, logradouro, numero, profissao, ativo } = data;

    try {
      const date = new Date();
      await this.sqlConnection.request()
      .input('nome', sql.VarChar(100), nome)
      .input('cpf', sql.VarChar(11), cpf)
      .input('rg', sql.VarChar(9), rg)
      .input('dtNascimento', sql.Date, dtNascimento)
      .input('email', sql.VarChar(100), email)
      .input('celular', sql.VarChar(11), celular)
      .input('sexo', sql.VarChar(1), sexo)
      .input('estCivil', sql.VarChar(1), estCivil)
      .input('profissao', sql.VarChar(50), profissao)
      .input('cep', sql.VarChar(8), cep)
      .input('logradouro', sql.VarChar(100), logradouro)
      .input('bairro', sql.VarChar(100), bairro)
      .input('numero', sql.Int, numero)
      .input('complemento', sql.VarChar(100), complemento)
      .input('idCidade', sql.Int, idCidade)
      .input('ativo', sql.Bit, ativo)
      .input('dtCadastro', sql.DateTime, date)
      .input('dtUltAlt', sql.DateTime, date).query`
        INSERT INTO responsaveis (nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, profissao, cep, logradouro, bairro, numero, complemento, idCidade, ativo, dtCadastro, dtUltAlt)
        VALUES (@nome, @cpf, @rg, @dtNascimento, @email, @celular, @sexo, @estCivil, @profissao, @cep, @logradouro, @bairro, @numero, @complemento, @idCidade, @ativo, @dtCadastro, @dtUltAlt)
      `;
      return {message: 'Responsável criado com sucesso!'}
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('SELECT * FROM responsaveis');
      return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `SELECT * FROM responsaveis WHERE id = ${id}`,
      );

      const cep = await this.cityService.findCEP(r.recordset[0].idCidade);

      if (r.recordset.length > 0) {
        return {...r.recordset[0], ...cep};
      } else {
        return { error: 'Responsável não encontrado!'}
      }
    } catch(e) {
      return e;
    }
  }

  async update(id: number, data: Responsible) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, 
      cep, bairro, complemento, idCidade, logradouro, numero, profissao, ativo } = data;

    try {
      const date = new Date();
      const r = await this.sqlConnection.request()
      .input('nome', sql.VarChar(100), nome)
      .input('cpf', sql.VarChar(11), cpf)
      .input('rg', sql.VarChar(9), rg)
      .input('dtNascimento', sql.Date, dtNascimento)
      .input('email', sql.VarChar(100), email)
      .input('celular', sql.VarChar(11), celular)
      .input('sexo', sql.VarChar(1), sexo)
      .input('estCivil', sql.VarChar(1), estCivil)
      .input('profissao', sql.VarChar(50), profissao)
      .input('cep', sql.VarChar(8), cep)
      .input('logradouro', sql.VarChar(100), logradouro)
      .input('bairro', sql.VarChar(100), bairro)
      .input('numero', sql.Int, numero)
      .input('complemento', sql.VarChar(100), complemento)
      .input('idCidade', sql.Int, idCidade)
      .input('ativo', sql.Bit, ativo)
      .input('dtCadastro', sql.DateTime, date)
      .input('dtUltAlt', sql.DateTime, date).query`
        UPDATE responsaveis
        SET nome = @nome, cpf = @cpf, rg = @rg, dtNascimento = @dtNascimento, email = @email, celular = @celular, sexo = @sexo, 
        estCivil = @estCivil, profissao = @profissao, cep = @cep, logradouro = @logradouro, bairro = @bairro, numero = @numero, 
        complemento = @complemento, idCidade = @idCidade, ativo = @ativo, dtCadastro = @dtCadastro, dtUltAlt = @dtUltAlt
        WHERE id = ${id};SELECT @@ROWCOUNT AS rowsAffected;
      `;

      if (r.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Responsável não encontrado para atualização'); // Se nenhuma linha foi atualizada
      }

      return {message: 'Responsável atualizado com sucesso!'}
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlConnection.request()
      .query(`delete from responsaveis where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`);

      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Responsável não encontrado para exclusão');
      }
      return {
        message: 'Responsável excluído com sucesso!',
      }
    } catch (error) {
      throw new BadRequestException(`Ocorreu um errro: ${error.message}`);
    }
  }
}
