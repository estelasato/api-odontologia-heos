import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { AccReceivableService } from './acc-receivable.service';
import { CreateAccReceivableDto, FilterAccReceivableDto } from './dto/create-acc-receivable.dto';
import { UpdateAccReceivableDto } from './dto/update-acc-receivable.dto';

@Controller('acc-receivable')
export class AccReceivableController {
  constructor(private readonly accReceivableService: AccReceivableService) {}

  @Post()
  create(@Body() createAccReceivableDto: CreateAccReceivableDto) {
    return this.accReceivableService.create(createAccReceivableDto);
  }

  @Get()
  findAll( @Query() filter: FilterAccReceivableDto) {
    return this.accReceivableService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accReceivableService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAccReceivableDto: UpdateAccReceivableDto) {
    return this.accReceivableService.update(+id, updateAccReceivableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accReceivableService.remove(+id);
  }
}
