import { Module } from '@nestjs/common';
import { modules } from './infra/modules';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
  ConfigModule.forRoot(),
  ...modules,
],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule {}
