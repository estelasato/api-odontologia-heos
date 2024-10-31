import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { HabitService } from './habit.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  create(@Body() data: BasicFormDto, @Req() req) {
    const { id, role } = req.usuario;
    return this.habitService.create({...data, idUser: id, typeUser: role});
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
  update(@Param('id') idHabit: number, @Body() data: BasicFormDto, @Req() req) {
    const { id, role } = req.usuario;
    return this.habitService.update(+idHabit, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.habitService.remove(id);
  }
}
