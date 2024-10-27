import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { DatabaseModule } from 'src/db.module';
import { InstallmentsModule } from '../installments/installments.module';

@Module({
  imports: [DatabaseModule, InstallmentsModule],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
