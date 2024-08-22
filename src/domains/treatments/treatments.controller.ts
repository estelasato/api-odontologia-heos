import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { filterTreatmentDto, TreatmentDto } from './dto/treatment.dto';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  create(@Body() createTreatmentDto: TreatmentDto) {
    return this.treatmentsService.create(createTreatmentDto);
  }

  @Get()
  findAll(@Query() filter: filterTreatmentDto) {
    return this.treatmentsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTreatmentDto: TreatmentDto) {
    return this.treatmentsService.update(+id, updateTreatmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treatmentsService.remove(+id);
  }
}
