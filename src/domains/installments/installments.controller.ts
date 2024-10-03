import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Controller('installments')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Post()
  async create(@Body() createInstallmentDto: CreateInstallmentDto) {
    return this.installmentsService.create(createInstallmentDto);
  }

  @Get()
  async findAll() {
    return this.installmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.installmentsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInstallmentDto: UpdateInstallmentDto) {
    return this.installmentsService.update(+id, updateInstallmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.installmentsService.remove(+id);
  }
}
