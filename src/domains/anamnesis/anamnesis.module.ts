import { Module } from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisController } from './anamnesis.controller';

@Module({
  controllers: [AnamnesisController],
  providers: [AnamnesisService],
})
export class AnamnesisModule {}
