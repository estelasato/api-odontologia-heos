import { PartialType } from '@nestjs/mapped-types';
import { createBudgetDto, CreateBudgetDto } from './create-budget.dto';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}
export class updateBudgetDto extends PartialType(createBudgetDto) {}
