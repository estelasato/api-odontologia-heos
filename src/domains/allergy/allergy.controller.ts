import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post()
  create(@Body() data: BasicFormDto) {
    return this.allergyService.create(data);
  }

  @Get()
  findAll() {
    return this.allergyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.allergyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: BasicFormDto) {
    return this.allergyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.allergyService.remove(id);
  }
}
