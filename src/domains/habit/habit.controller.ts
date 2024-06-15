import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { HabitService } from './habit.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@Body() data: BasicFormDto) {
    return this.habitService.create(data);
  }

  @Get()
  findAll() {
    return this.habitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.habitService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: BasicFormDto) {
    return this.habitService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.habitService.remove(id);
  }
}
