import { Module } from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisController } from './anamnesis.controller';
import { DatabaseModule } from 'src/db.module';
import { IllnessModule } from '../illness/illness.module';
import { IllnessAnamnesisService } from './entities/illness_anamnesis/illness_anamnesis.service';
import { MedAnamnesisService } from './entities/med_anamnesis/med_anamnesis.service';
import { AllergiesAnamnesisService } from './entities/allergies_anamnesis/allergies_anamnesis.service';

@Module({
  imports: [DatabaseModule, IllnessModule],
  controllers: [AnamnesisController],
  providers: [AnamnesisService, IllnessAnamnesisService, MedAnamnesisService, AllergiesAnamnesisService],
})
export class AnamnesisModule {}
