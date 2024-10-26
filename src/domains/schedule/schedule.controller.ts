import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDto, ScheduleFilterDto } from './dto/schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createSchedule: ScheduleDto) {
    return this.scheduleService.create(createSchedule);
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
  update(@Param('id') id: string, @Body() data: ScheduleDto) {
    return this.scheduleService.update(+id, data.horario, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query() query: {horario: any}) {
    return this.scheduleService.remove(+id, query.horario);
  }
}
