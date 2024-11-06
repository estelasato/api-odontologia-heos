import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as sql from 'mssql';
import { CityService } from '../city/city.service';
import { Professional, ProfessionalDto } from './dto/professional.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class ProfessionalService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cityService: CityService,
    private readonly usuarioService: UsuariosService,
  ) {}

  async create(data: Professional) {
    const {
      nome,
      cpfCnpj,
      rg,
      dtNascimento,
      email,
      celular,
      sexo,
      estCivil,
      cro,
      certificacoes,
      especialidade,
      formacoes,
      cep,
      bairro,
      complemento,
      idCidade,
      logradouro,
      numero,
      ativo,
      idUser,
      typeUser,
      senha
    } = data;

    try {
      const date = new Date();
      const result = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpfCnpj', sql.VarChar(14), cpfCnpj)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(100), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('cro', sql.VarChar(6), cro)
        .input('certificacoes', sql.VarChar(100), certificacoes)
        .input('especialidade', sql.VarChar(100), especialidade)
        .input('formacoes', sql.VarChar(100), formacoes)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(100), logradouro)
        .input('bairro', sql.VarChar(100), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(100), complemento)
        .input('idCidade', sql.Int, idCidade)
        .input('ativo', sql.Bit, 1)
        .input('dtCadastro', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query`
        INSERT INTO profissionais (idUser, typeUser, nome, cpfCnpj, rg, dtNascimento, email, celular, sexo, estCivil, cro, certificacoes, especialidade, formacoes, cep, logradouro, bairro, numero, complemento, idCidade, ativo, dtCadastro, dtUltAlt)
        VALUES (@idUser, @typeUser, @nome, @cpfCnpj, @rg, @dtNascimento, @email, @celular, @sexo, @estCivil, @cro, @certificacoes, @especialidade, @formacoes, @cep, @logradouro, @bairro, @numero, @complemento, @idCidade, @ativo, @dtCadastro, @dtUltAlt)
       SELECT * FROM funcionarios WHERE id = SCOPE_IDENTITY()
        `;
        const insertedRecord = result.recordset[0];

        if (senha && email) {
          await this.usuarioService.create({
            role: 'profissional',
            email,
            senha,
            ativo: ativo,
            nome,
          });
        } 
      return { message: 'Profissional criado com sucesso!' };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query(
        'SELECT * from profissionais',
      );
      if (result.recordset.length === 0) {
        return { message: 'Nenhum profissional encontrado' };
      } else return result.recordset;
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const r = await this.sqlConnection.query(
        `SELECT * FROM profissionais WHERE id = ${id}`,
      );

      const cep = await this.cityService.findCEP(r.recordset[0].idCidade);

      if (r.recordset.length > 0) {
        return { ...r.recordset[0], ...cep };
      } else {
        return { err: 'profissional não encontrado!' };
      }
    } catch (e) {
      return e;
    }
  }

  async update(id: number, data: Professional) {
    const {
      nome,
      cpfCnpj,
      rg,
      dtNascimento,
      email,
      celular,
      sexo,
      estCivil,
      cro,
      certificacoes,
      especialidade,
      formacoes,
      cep,
      bairro,
      complemento,
      idCidade,
      logradouro,
      numero,
      ativo,
      idUser,
      typeUser,
      senha
    } = data;

    try {
      const prof = await this.findOne(id);
      if (prof.error || !prof) {
        throw new NotFoundException('Profissional não encontrado para atualização');
      }

      // se alterou o email ou nome altera o login tbm
      if (prof.email !== email || prof.nome !== nome) {
        try {
          if (senha && email) {
            await this.usuarioService.changePwd({email: prof.email, senhaNova: senha});
          }
          await this.usuarioService.update({nome, email});
        } catch (e) {
          throw new BadRequestException(`Ocorreu um errro ao atualizar usuario: ${e.message}`);
        }
      }

      const date = new Date();
      const r = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar(50), nome)
        .input('cpfCnpj', sql.VarChar(14), cpfCnpj)
        .input('rg', sql.VarChar(9), rg)
        .input('dtNascimento', sql.Date, dtNascimento)
        .input('email', sql.VarChar(100), email)
        .input('celular', sql.VarChar(11), celular)
        .input('sexo', sql.VarChar(1), sexo)
        .input('estCivil', sql.VarChar(1), estCivil)
        .input('cro', sql.VarChar(6), cro)
        .input('certificacoes', sql.VarChar(100), certificacoes)
        .input('especialidade', sql.VarChar(100), especialidade)
        .input('formacoes', sql.VarChar(100), formacoes)
        .input('cep', sql.VarChar(8), cep)
        .input('logradouro', sql.VarChar(100), logradouro)
        .input('bairro', sql.VarChar(100), bairro)
        .input('numero', sql.Int, numero)
        .input('complemento', sql.VarChar(100), complemento)
        .input('idCidade', sql.Int, idCidade)
        .input('ativo', sql.Bit, ativo)
        .input('dtCadastro', sql.DateTime, date)
        .input('idUser', sql.Int, idUser)
        .input('typeUser', sql.VarChar(10), typeUser)
        .input('dtUltAlt', sql.DateTime, date).query(`
        UPDATE profissionais
        SET idUser=@idUser, typeUser=@typeUser, nome = @nome, cpfCnpj = @cpfCnpj, rg = @rg, dtNascimento = @dtNascimento, email = @email, celular = @celular, 
        sexo = @sexo, estCivil = @estCivil, cro = @cro, certificacoes = @certificacoes, 
        especialidade = @especialidade, formacoes = @formacoes, cep = @cep, logradouro = @logradouro, bairro = @bairro, 
        numero = @numero, complemento = @complemento, idCidade = @idCidade, ativo = @ativo, dtUltAlt = @dtUltAlt
        WHERE id = ${id}; SELECT @@ROWCOUNT AS rowsAffected;
        `);

      if (r.recordset[0].rowsAffected === 0) {
        throw new NotFoundException(
          'Profissional não encontrado para atualização',
        ); // Se nenhuma linha foi atualizada
      }

      return { message: 'Profissional atualizado com sucesso!' };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.sqlConnection
        .request()
        .query(
          `delete from profissionais where id = ${id}; select @@ROWCOUNT AS rowsAffected;`,
        );
      if (deleteResult.recordset[0].rowsAffected === 0) {
        throw new NotFoundException(
          'Profissional não encontrado para exclusão',
        );
      }

      return {
        message: 'Profissional excluído com sucesso!',
      };
    } catch (err) {
      throw new BadRequestException(`Ocorreu um errro: ${err.message}`);
    }
  }
}
