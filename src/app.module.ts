import { Module } from '@nestjs/common';
import { modules } from './infra/modules';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { providers } from './infra/providers';
import { DatabaseModule } from './db.module';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' }
    }),
    PassportModule,
    ...modules,
  ],
  controllers: [],
  providers: [...providers],
})
export class AppModule {}
