import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import * as sql from 'mssql';
import { CityService } from '../city/city.service';

@Injectable()
export class PatientService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cityService: CityService
  ) {}
  async create(createPatientDto: CreatePatientDto) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, obs, 
      cep, bairro, complemento, idCidade, logradouro, numero, profissao, indicacao, ativo, } = createPatientDto
    
    try {
      const date = new Date();
      await this.sqlConnection.request()
      .input('nome', sql.VarChar(50), nome)
      .input('cpf', sql.VarChar(11), cpf)
      .input('rg', sql.VarChar(9), rg)
      .input('dtNascimento', sql.Date, dtNascimento)
      .input('email', sql.VarChar(50), email)
      .input('celular', sql.VarChar(11), celular)
      .input('sexo', sql.VarChar(1), sexo)
      .input('estCivil', sql.VarChar(1), estCivil)
      .input('obs', sql.VarChar(100), obs)
      .input('profissao', sql.VarChar(50), profissao)
      .input('indicacao', sql.VarChar(100), indicacao)
      .input('cep', sql.VarChar(8), cep)
      .input('logradouro', sql.VarChar(100), logradouro)
      .input('bairro', sql.VarChar(100), bairro)
      .input('numero', sql.Int, numero)
      .input('complemento', sql.VarChar(100), complemento)
      .input('idCidade', sql.Int, idCidade)
      .input('ativo', sql.Bit, ativo)
      .input('dtCadastro', sql.Date, date)
      .input('dtUltAlt', sql.Date, date).query`
        INSERT INTO pacientes (nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, obs, profissao, indicacao, 
        cep, logradouro, bairro, numero, complemento, ativo, dtCadastro, dtUltAlt)
        VALUES (@nome, @cpf, @rg, @dtNascimento, @email, @celular, @sexo, @estCivil, @obs, @profissao, @indicacao,
        @cep, @logradouro, @bairro, @numero, @complemento, @ativo, @dtCadastro, @dtUltAlt)
      `;

      return {message: 'Paciente criado com sucesso!'}
    } catch(error) {
      return error
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query('SELECT * FROM pacientes');
      return result.recordset;
    } catch (error) {
      return error
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `SELECT * FROM pacientes WHERE id = ${id}`,
      );

      const cep = await this.cityService.findCEP(r.recordset[0].idCidade);

      if (r.recordset.length > 0) {
        return {...r.recordset[0], ...cep};
      } else {
        return { error: 'Funcionário não encontrado!'}
      }
    } catch(e) {
      return e;
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, obs, 
      cep, bairro, complemento, idCidade, logradouro, numero, profissao, indicacao, ativo, } = updatePatientDto
    
    try {
      const date = new Date();
      const r = await this.sqlConnection.request()
      .input('nome', sql.VarChar(50), nome)
      .input('cpf', sql.VarChar(11), cpf)
      .input('rg', sql.VarChar(9), rg)
      .input('dtNascimento', sql.Date, dtNascimento)
      .input('email', sql.VarChar(50), email)
      .input('celular', sql.VarChar(11), celular)
      .input('sexo', sql.VarChar(1), sexo)
      .input('estCivil', sql.VarChar(1), estCivil)
      .input('obs', sql.VarChar(100), obs)
      .input('profissao', sql.VarChar(50), profissao)
      .input('indicacao', sql.VarChar(100), indicacao)
      .input('cep', sql.VarChar(8), cep)
      .input('logradouro', sql.VarChar(100), logradouro)
      .input('bairro', sql.VarChar(100), bairro)
      .input('numero', sql.Int, numero)
      .input('complemento', sql.VarChar(100), complemento)
      .input('idCidade', sql.Int, idCidade)
      .input('ativo', sql.Bit, ativo)
      .input('dtUltAlt', sql.Date, date).query`
        UPDATE pacientes
        SET nome = @nome, cpf = @cpf, rg = @rg, dtNascimento = @dtNascimento, email = @email, celular = @celular, 
        sexo = @sexo, estCivil = @estCivil, obs = @obs, profissao = @profissao, indicacao = @indicacao, cep = @cep, 
        logradouro = @logradouro, bairro = @bairro, numero = @numero, complemento = @complemento, idCidade = @idCidade, 
        ativo = @ativo, dtUltAlt = @dtUltAlt
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
      `;

      if (r.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Paciente não encontrado para atualização'); // Se nenhuma linha foi atualizada
      }

      return {message: 'Paciente criado com sucesso!'}
    } catch(error) {
      return error
    }
  }

  async remove(id: number) {
    try {
      const result = await this.sqlConnection.request()
      .query(`delete from pacientes where id = ${id}; SELECT @@ROWCOUNT AS rowsAffected`);

      if (result.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Paciente não encontrado para exclusão');
      }
      return {
        message: 'Paciente excluído com sucesso!',
      }
    } catch (error) {
      return error
    }
  }
}
