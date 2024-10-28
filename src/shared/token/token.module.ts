import { Module } from '@nestjs/common'
import { ITokenProvider } from './ITokenProvider';
import { JWTGateway } from './jwt.gateway';
import { TokenProvider } from './token.service';


@Module({
  providers: [{ provide: ITokenProvider, useClass: TokenProvider }, JWTGateway],
  exports: [{ provide: ITokenProvider, useClass: TokenProvider }, JWTGateway],
})
export class TokenModule {}
