import { Module } from '@nestjs/common';
import { AccReceivableService } from './acc-receivable.service';
import { AccReceivableController } from './acc-receivable.controller';
import { DatabaseModule } from 'src/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccReceivableController],
  providers: [AccReceivableService],
  exports: [AccReceivableService],
})
export class AccReceivableModule {}
