import { Module } from '@nestjs/common';
import { PaymentTermsService } from './payment-terms.service';
import { PaymentTermsController } from './payment-terms.controller';
import { DatabaseModule } from 'src/db.module';
import { InstallmentsModule } from '../installments/installments.module';

@Module({
  imports: [DatabaseModule, InstallmentsModule],
  controllers: [PaymentTermsController],
  providers: [PaymentTermsService],
})
export class PaymentTermsModule {}
