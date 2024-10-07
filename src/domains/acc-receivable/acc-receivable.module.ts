import { Module } from '@nestjs/common';
import { AccReceivableService } from './acc-receivable.service';
import { AccReceivableController } from './acc-receivable.controller';

@Module({
  controllers: [AccReceivableController],
  providers: [AccReceivableService],
})
export class AccReceivableModule {}
