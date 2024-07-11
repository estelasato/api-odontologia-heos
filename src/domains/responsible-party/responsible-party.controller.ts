import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ResponsiblePartyService } from './responsible-party.service';
import { ResponsibleDto } from './dto/responsible-party.dto';

@Controller('responsible-party')
export class ResponsiblePartyController {
  constructor(private readonly responsiblePartyService: ResponsiblePartyService) {}

  @Post()
  create(@Body() createResponsiblePartyDto: ResponsibleDto) {
    return this.responsiblePartyService.create(createResponsiblePartyDto);
  }

  @Get()
  findAll() {
    return this.responsiblePartyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.responsiblePartyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateResponsiblePartyDto: ResponsibleDto) {
    return this.responsiblePartyService.update(+id, updateResponsiblePartyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.responsiblePartyService.remove(+id);
  }
}
