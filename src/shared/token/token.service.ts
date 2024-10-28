import { Inject, Injectable } from '@nestjs/common'
import { JWTGateway } from './jwt.gateway'

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jWTGateway: JWTGateway,
  ) {
    const provider = {
      jwt: this.jWTGateway,
    }

    return provider[process.env.TOKEN_DRIVER]
  }
}
