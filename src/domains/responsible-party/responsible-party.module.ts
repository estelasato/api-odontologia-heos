import { Module } from '@nestjs/common';
import { ResponsiblePartyService } from './responsible-party.service';
import { ResponsiblePartyController } from './responsible-party.controller';
import { DatabaseModule } from 'src/db.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [DatabaseModule, CityModule],
  controllers: [ResponsiblePartyController],
  providers: [ResponsiblePartyService],
})
export class ResponsiblePartyModule {}
