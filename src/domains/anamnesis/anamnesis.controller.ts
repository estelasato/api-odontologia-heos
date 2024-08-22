import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisDto, AnamnesisFilterDto } from './dto/anamnesisDto';
import { query } from 'express';


@Controller('anamnesis')
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  create(@Body() createAnamnesisDto: AnamnesisDto) {
    return this.anamnesisService.create(createAnamnesisDto);
  }

  @Get()
  findAll(@Query() filter: AnamnesisFilterDto) {
    return this.anamnesisService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.anamnesisService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAnamnesisDto: AnamnesisDto) {
    return this.anamnesisService.update(+id, updateAnamnesisDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anamnesisService.remove(+id);
  }
}
