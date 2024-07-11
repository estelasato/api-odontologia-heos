import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalDto } from './dto/professional.dto';

@Controller('professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  create(@Body() createProfessionalDto: ProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
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
  update(@Param('id') id: number, @Body() updateProfessionalDto: ProfessionalDto) {
    return this.professionalService.update(+id, updateProfessionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.professionalService.remove(+id);
  }
}
