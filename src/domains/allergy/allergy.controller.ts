import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post()
  create(@Body() data: BasicFormDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.allergyService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.allergyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.allergyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') idAllergy: number, @Body() data: BasicFormDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.allergyService.update(idAllergy, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.allergyService.remove(id);
  }
}
