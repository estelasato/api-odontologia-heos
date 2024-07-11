import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientDto } from './dto/patient.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: PatientDto) {
    return this.patientService.create(createPatientDto);
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
  update(@Param('id') id: number, @Body() updatePatientDto: PatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientService.remove(+id);
  }
}
