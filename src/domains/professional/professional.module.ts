import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { DatabaseModule } from 'src/db.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [DatabaseModule, CityModule],
  controllers: [ProfessionalController],
  providers: [ProfessionalService],
})
export class ProfessionalModule {}
