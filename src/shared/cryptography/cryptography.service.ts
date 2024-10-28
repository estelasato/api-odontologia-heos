import { Inject, Injectable } from '@nestjs/common'
import { BCryptGateway } from './bcrypt.gateway'

@Injectable()
export class CryptographyProvider {
  constructor(
    private readonly bCryptGateway: BCryptGateway,
  ) {
    const provider = {
      bcrypt: this.bCryptGateway,
    }

    return provider[process.env.CRYPTOGRAPHY_DRIVER]
  }
}
