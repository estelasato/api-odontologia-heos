import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDto, ScheduleFilterDto } from './dto/schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() data: ScheduleDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.scheduleService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll(@Query() filter: ScheduleFilterDto) {
    return this.scheduleService.findAll(filter);
  }

  @Get(':id') // id do profissional
  findOne(@Param('id') id: string, @Query() query: {idPaciente: number, horario: any}) {
    return this.scheduleService.findOne(+id, query.horario);
  }

  @Put(':id')
  update(@Param('id') idSchedule: string, @Body() data: ScheduleDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.scheduleService.update(+idSchedule, data.horario, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query() query: {horario: any}) {
    return this.scheduleService.remove(+id, query.horario);
  }
}
