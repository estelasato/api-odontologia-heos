import { Module } from '@nestjs/common';
import { ResponsiblePartyService } from './responsible-party.service';
import { ResponsiblePartyController } from './responsible-party.controller';

@Module({
  controllers: [ResponsiblePartyController],
  providers: [ResponsiblePartyService],
})
export class ResponsiblePartyModule {}
