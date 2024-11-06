import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DatabaseModule } from 'src/db.module';
import { AccReceivableModule } from '../acc-receivable/acc-receivable.module';

@Module({
  imports: [DatabaseModule, AccReceivableModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
