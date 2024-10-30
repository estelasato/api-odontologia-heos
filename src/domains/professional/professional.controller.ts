import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalDto } from './dto/professional.dto';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  create(@Body() data: ProfessionalDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.professionalService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.professionalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.professionalService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idProf: number, @Body() data: ProfessionalDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.professionalService.update(+idProf, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.professionalService.remove(+id);
  }
}
