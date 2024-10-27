import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { DatabaseModule } from 'src/db.module';
import { BudgetTreatmentsService } from './entities/budget-treatments/budget-treatments.service';
import { AccReceivableModule } from '../acc-receivable/acc-receivable.module';

@Module({
  imports: [DatabaseModule, AccReceivableModule],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetTreatmentsService],
})
export class BudgetsModule {}
