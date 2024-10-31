import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetFilterDto, CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Body() data: CreateBudgetDto, @Req() req) {
    const  {id, role} = req.usuario;
    return this.budgetsService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll(@Param() filter?: BudgetFilterDto) {
    return this.budgetsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idBudget: string, @Body() data: UpdateBudgetDto, @Req() req) {
    const  {id, role} = req.usuario;
    return this.budgetsService.update(+idBudget, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetsService.remove(+id);
  }
}
