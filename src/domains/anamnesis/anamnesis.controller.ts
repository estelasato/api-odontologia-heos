import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Req } from '@nestjs/common';
import { AnamnesisService } from './anamnesis.service';
import { AnamnesisDto, AnamnesisFilterDto } from './dto/anamnesisDto';
import { query } from 'express';


@Controller('anamnesis')
export class AnamnesisController {
  constructor(private readonly anamnesisService: AnamnesisService) {}

  @Post()
  create(@Body() data: AnamnesisDto, @Req() req) {
    const { id, role } = req.usuario
    return this.anamnesisService.create({...data, idUser: id, typeUser: role});
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
  update(@Param('id') idAnamnese: string, @Body() data: AnamnesisDto, @Req() req) {
    const { id, role } = req.usuario
    return this.anamnesisService.update(+idAnamnese, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anamnesisService.remove(+id);
  }
}
