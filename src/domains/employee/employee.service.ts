import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployee } from './dto/create-employee.dto';
import { UpdateEmployee } from './dto/update-employee.dto';
import * as sql from 'mssql';
import { CityService } from '../city/city.service';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cityService: CityService
  ) {}

  async create(data: CreateEmployee) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, ativo, cargo, salario, pis, dtAdmissao, dtDemissao,
       cep, bairro, complemento, idCidade, logradouro, numero} = data;
    const date = new Date();

    try {
        // // Verifica duplicidade de CPF, Email e PIS
        // const existingEmployee = await this.sqlConnection
        //     .request()
        //     .input('cpf', sql.VarChar(11), cpf)
        //     .input('email', sql.VarChar(100), email)
        //     .input('pis', sql.VarChar(11), pis)
        //     .query(`
        //         SELECT 1 FROM funcionarios 
        //         WHERE cpf = @cpf OR email = @email OR pis = @pis
        //     `);
        
        // if (existingEmployee.recordset.length > 0) {
        //     throw new BadRequestException(`Funcionário com CPF, Email ou PIS já existe.`);
        // }
      const result = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpf', sql.VarChar(11), cpf)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('ativo', sql.Bit, ativo)
        .input('cargo', sql.VarChar(50), cargo)
        .input('salario', sql.Decimal(18, 2), salario)
        .input('pis', sql.VarChar(11), pis)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(100), logradouro)
        .input('bairro', sql.VarChar(100), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(100), complemento)
        .input('dtAdmissao', sql.Date, dtAdmissao)
        .input('dtDemissao', sql.Date, dtDemissao)
        .input('idCidade', sql.Int, idCidade)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query`
          INSERT INTO funcionarios (nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, ativo, cargo, salario, pis, dtAdmissao, dtDemissao, idCidade, dtCadastro, dtUltAlt)

          values (@nome, @cpf, @rg, @dtNascimento, @email, @celular, @sexo, @estCivil, @ativo, @cargo, @salario, @pis, @dtAdmissao, @dtDemissao, @idCidade, @dtCadastro, @dtUltAlt)
        `;
        console.log(result)

        return {message: 'Funcionário criado com sucesso!'}
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query(
        'SELECT * FROM funcionarios',
      );
      const data = await Promise.all(result.recordset?.map(async (e) => {
        const city = await this.sqlConnection.query(
          `select * from cidades where id = ${e.idCidade}`
        );
        if (city.rowsAffected > 0) {
          const c = city.recordset[0];
          return {...e, cidade: {id: c.idCidade, cidade: c.cidade}};
        } else return e
      }))
      return data
    } catch(err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `SELECT * FROM funcionarios WHERE id = ${id}`,
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

  async update(id: number, data: UpdateEmployee) {
    const { nome, cpf, rg, dtNascimento, email, celular, sexo, estCivil, ativo, cargo, salario, pis, dtAdmissao, dtDemissao, idCidade, cep, complemento, numero, bairro,  logradouro} = data;
    const date = new Date();

    try {
      const updateResult = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpf', sql.VarChar(11), cpf)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('ativo', sql.Bit, ativo)
        .input('cargo', sql.VarChar(50), cargo)
        .input('salario', sql.Decimal(18, 2), salario)
        .input('pis', sql.VarChar(11), pis)
        .input('dtAdmissao', sql.Date, dtAdmissao)
        .input('dtDemissao', sql.Date, dtDemissao)
        .input('idCidade', sql.Int, idCidade)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(50), logradouro)
        .input('bairro', sql.VarChar(50), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(50), complemento)
        .input('dtUltAlt', date).query(`
          update funcionarios
          set nome = @nome, cpf = @cpf, rg = @rg, dtNascimento = @dtNascimento, email = @email, celular = @celular, sexo = @sexo, estCivil = @estCivil, ativo = @ativo, cargo = @cargo, salario = @salario, pis = @pis, dtAdmissao = @dtAdmissao, dtDemissao = @dtDemissao, idCidade = @idCidade, cep = @cep, logradouro = @logradouro, bairro = @bairro, numero = @numero, complemento = @complemento, dtUltAlt = @dtUltAlt
          where id = ${id}; select @@ROWCOUNT AS rowsAffected;
          `);

          if (updateResult.recordset[0].rowsAffected === 0) {
            throw new NotFoundException('Funcionário não encontrado para atualização'); 
          }

          return {
            message: 'Funcionário atualizado com sucesso!',
          };
    } catch (error) {
      throw new BadRequestException(`Ocorreu um errro: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.sqlConnection
        .request()
        .query(
          `delete from funcionarios where id = ${id}; select @@ROWCOUNT AS rowsAffected;`
        );
      if (deleteResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException('Funcionário não encontrado para exclusão');
      }

      return {
        message: 'Funcionário excluído com sucesso!',
      }
    } catch(err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }
}
