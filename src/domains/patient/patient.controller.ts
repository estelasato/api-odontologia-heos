import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientDto } from './dto/patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() data: PatientDto, @Req() req) {
    const { id, role} = req.usuario
    return this.patientService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.patientService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idPatient: number, @Body() data: PatientDto, @Req() req) {
    const { id, role} = req.usuario
    return this.patientService.update(+idPatient, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientService.remove(+id);
  }
}
