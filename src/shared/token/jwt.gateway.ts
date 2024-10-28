import { Injectable } from "@nestjs/common"
import { DecodeInput, DecodeOutput, ITokenProvider, SingInput } from "./ITokenProvider"
import { sign as _sign, SignOptions, verify } from 'jsonwebtoken'

@Injectable()
export class JWTGateway implements ITokenProvider {
  public async sign(data: SingInput): Promise<string> {
    const options: SignOptions = {}

    if(data.jwtExpiresIn) {
      options.expiresIn = data.jwtExpiresIn
    }

    return _sign(
      {
        id: data.id,
        name: data.nome,
        email: data.email,
        role: data.role,
      },
      data.jwtSecret,
      options
    )
  }

  public async decode(data: DecodeInput): Promise<DecodeOutput> {
    const decodeToken = verify(data.token, data.jwtSecret) as DecodeOutput

    return decodeToken
  }
}
