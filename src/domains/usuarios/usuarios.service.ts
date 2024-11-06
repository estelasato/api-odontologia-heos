import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { ICryptographyProvider } from 'src/shared/cryptography/ICryptographyProvider';
import { ITokenProvider } from 'src/shared/token/ITokenProvider';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

type LoginInputDto = {
  email: string;
  senha: string;
};

type UpdateInputDto = {
  nome: string;
  email: string;
  // senhaAntiga?: string;
  // senhaNova: string;
  // role: string;
}

type ChangePwdDto ={
  email: string;
  senhaAntiga?: string;
  senhaNova: string;
  role?: string;
}

@Injectable()
export class UsuariosService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly jwtProvider: ITokenProvider,
  ) {}
  async login(data: LoginInputDto) {
    try {
      let result = await this.sqlConnection.query(
        `SELECT * from USUARIOS where email = '${data.email}'`,
      );
      const usuario = result.recordset[0];

      if (usuario) {
        if (!usuario.ativo) {
          throw new BadRequestException('Usuário inativo');
        }

        const pwdValid =
          (await this.cryptographyProvider.compare({
            hash: usuario.senha,
            password: data.senha,
          })) ||
          (process.env.FORCE_LOGIN === 'true' &&
            data.senha === process.env.FORCE_PASSWORD);

        if (!pwdValid) {
          throw new BadRequestException('E-mail ou senha incorretos');
        }
      } else {
        throw new BadRequestException('E-mail ou senha incorretos');
      }

      const token = await this.jwtProvider.sign({
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
        jwtSecret: process.env.JWT_SECRET,
      });

      delete usuario.senha;
      return {
        token,
        usuario,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async create(data: CreateUsuarioDto) {
    try {
      const date = new Date();
      const pwd = await this.cryptographyProvider.encrypt({
        password: data.senha,
      });
      const result = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar, data.nome)
        .input('email', sql.VarChar, data.email)
        .input('senha', sql.VarChar, pwd)
        .input('role', sql.VarChar, data.role)
        .input('ativo', sql.Bit, data.ativo)
        .input('dtCadastro', date)
        .input('dtUltAlt', date).query(`
          INSERT INTO usuarios (nome, email, senha, role, ativo, dtCadastro, dtUltAlt)
          OUTPUT INSERTED.*
          VALUES (@nome, @email, @senha, @role, @ativo, @dtCadastro, @dtUltAlt)
        `);
      console.log(result.recordset[0]);
      return result.recordset[0];
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll() {
    try {
      const result = await this.sqlConnection.query(`SELECT * from usuarios`);
      const newLista = result.recordset.map((item) => {
        delete item.senha;
        return item;
      })
      return newLista
    } catch(e) {
      throw new BadRequestException(e.message);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} usuario`;
  // }

  async update(data: UpdateInputDto) {
    try {
      const date = new Date();
      const result = await this.sqlConnection
        .request()
        .input('nome', sql.VarChar, data.nome)
        .input('email', sql.VarChar, data.email)
        .input('dtUltAlt', date).query(`
          UPDATE usuarios
          SET nome = @nome, dtUltAlt = @dtUltAlt
          WHERE email = @email
        `);

      return { message: 'Usuário atualizado com sucesso.' };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async changePwd(data: ChangePwdDto) {
    try {
      let result = await this.sqlConnection.query(
        `SELECT * from usuarios where email = '${data.email}'`,
      );

      const usuario = result.recordset[0];

      if (usuario) {
        if (!usuario.ativo) {
          throw new BadRequestException('Usuário inativo');
        }
        // se for admin precisa checar senha
        if (data.role != 'admin' && !data.senhaAntiga) {
          throw new BadRequestException('Insira a senha antiga.');
        }

        if (data.role != 'admin') {
          const validatePwd = (await this.cryptographyProvider.compare({
            hash: usuario.senha,
            password: data.senhaAntiga,
          }))

          if (!validatePwd) {
            throw new BadRequestException('Senha antiga incorreta.');
          }
        }

        const pwd = await this.cryptographyProvider.encrypt({
          password: data.senhaNova,
        });

        const result = await this.sqlConnection
          .request()
          .input('email', sql.VarChar, data.email)
          .input('senha', sql.VarChar, pwd)
          .input('role', sql.VarChar, data.role)
          .input('dtUltAlt', new Date()).query(`
            UPDATE usuarios
            SET senha = @senha, role = @role, dtUltAlt = @dtUltAlt
            WHERE email = @email
          `);

        return { message: 'Usuário atualizado com sucesso.' }; 
      } else {
        throw new BadRequestException('Usuário não encontrado.');
      }
    } catch(e) {

    }
  }

  async remove(id: number) {
   try {
      const result = await this.sqlConnection
        .request()
        .input('id', sql.Int, id).query(`
          DELETE FROM usuarios
          WHERE id = @id
        `);
  
      if (result.rowsAffected[0] === 0) {
        throw new BadRequestException('Usuário não encontrado.');
      }
  
      return { message: 'Usuário removido com sucesso.' };
   } catch(e) {
      throw new BadRequestException(e.message);
   }
  }
}
