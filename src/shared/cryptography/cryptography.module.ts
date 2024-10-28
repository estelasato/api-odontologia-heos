import { Module } from '@nestjs/common'
import { BCryptGateway } from './bcrypt.gateway';
import { CryptographyProvider } from './cryptography.service';
import { ICryptographyProvider } from './ICryptographyProvider';

@Module({
  providers: [{ provide: ICryptographyProvider, useClass: CryptographyProvider }, BCryptGateway],
  exports: [{ provide: ICryptographyProvider, useClass: CryptographyProvider }, BCryptGateway],
})
export class CryptographyModule {}
