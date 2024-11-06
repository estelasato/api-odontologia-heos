import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { DatabaseModule } from 'src/db.module';
import { BudgetProcedureService } from './entities/budget-procedure/budget-treatments.service';
import { AccReceivableModule } from '../acc-receivable/acc-receivable.module';

@Module({
  imports: [DatabaseModule, AccReceivableModule],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetProcedureService],
})
export class BudgetsModule {}
