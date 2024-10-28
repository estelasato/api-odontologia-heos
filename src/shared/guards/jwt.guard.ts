import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard, IAuthGuard } from "@nestjs/passport";
import { ITokenProvider } from "../token/ITokenProvider";
import { IS_PUBLIC_KEY } from "../decorators/allow-public-access.decorator";
import * as sql from 'mssql';
import { UserRole } from "../strategies/jwt.strategy";

export type AuthenticatedPayload = {
  id: string | number
  email: string
  role: UserRole
  isActive: true
  iat: number
  exp: number
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor(
    private reflector: Reflector,
    private readonly tokenProvider: ITokenProvider,
    @Inject('SQL_CONNECTION')
    private readonly sqlConnection: sql.ConnectionPool,
  ){ super() }
  // private prisma: PrismaService,
  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    try {
      const request = this.getRequest(context)
      const token = this.getToken(request)

      const result = await this.tokenProvider.decode({ jwtSecret: process.env.JWT_SECRET, token })

      const user = await this.sqlConnection.query(
        `select * from usuarios where id=${result.id} AND ativo=1`,
      )

      if (!user) throw new UnauthorizedException(['Solicitação não autorizada.'])

      request.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException(['Solicitação não autorizada.'])
    }
  }

  handleRequest<Account extends AuthenticatedPayload>(_: Error, usuario: Account): Account {
    if (usuario) return usuario
    else throw new UnauthorizedException(['Solicitação não autorizada.'])
  }

  protected getToken(request: { headers: Record<string, string | string[]> }): string {
    const authorization = request.headers['authorization']
    if (!authorization) return

    if (Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header')
    }

    const [, token] = authorization.split(' ')

    return token
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }
}