import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { ResponsiblePartyService } from './responsible-party.service';
import { ResponsibleDto } from './dto/responsible-party.dto';

@Controller('responsible-party')
export class ResponsiblePartyController {
  constructor(private readonly responsiblePartyService: ResponsiblePartyService) {}

  @Post()
  create(@Body() data: ResponsibleDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.responsiblePartyService.create({...data, idUser: id, typeUser: role});
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
  update(@Param('id') idRP: number, @Body() data: ResponsibleDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.responsiblePartyService.update(+idRP, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.responsiblePartyService.remove(+id);
  }
}
