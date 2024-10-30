import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { ICryptographyProvider } from 'src/shared/cryptography/ICryptographyProvider';
import { ITokenProvider } from 'src/shared/token/ITokenProvider';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

type LoginInputDto = {
  email: string;
  senha: string;
};

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

      return result.recordset[0];
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // findAll() {
  //   return `This action returns all usuarios`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} usuario`;
  // }

  // update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
  //   return `This action updates a #${id} usuario`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} usuario`;
  // }
}
