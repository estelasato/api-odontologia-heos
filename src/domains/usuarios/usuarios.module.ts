import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { CryptographyModule } from 'src/shared/cryptography/cryptography.module';
import { TokenModule } from 'src/shared/token/token.module';
import { DatabaseModule } from 'src/db.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [DatabaseModule, CryptographyModule, TokenModule],
  exports	: [UsuariosService]
})
export class UsuariosModule {}
