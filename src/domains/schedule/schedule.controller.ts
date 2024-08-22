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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: ScheduleDto) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
