import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationService: MedicationsService) {}

  @Post()
  create(@Body() data: BasicFormDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.medicationService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.medicationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') idMed: number, @Body() data: BasicFormDto, @Req() req) {
    const { id, role } = req.usuario
    return this.medicationService.update(+idMed, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.medicationService.remove(id);
  }
}
