import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  create(@Body() data: BasicFormDto) {
    return this.medicationService.create(data);
  }

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.medicationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: BasicFormDto) {
    return this.medicationService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.medicationService.remove(id);
  }
}
