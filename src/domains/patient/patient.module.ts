import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { DatabaseModule } from 'src/db.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [DatabaseModule, CityModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
