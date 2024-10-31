import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Req } from '@nestjs/common';
import { TreatmentsService } from './treatments.service';
import { filterTreatmentDto, TreatmentDto } from './dto/treatment.dto';

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  create(@Body() data: TreatmentDto, @Req() req: any) {
    const {id, role} = req.usuario;
    return this.treatmentsService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.treatmentsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: filterTreatmentDto, @Req() req: any) {
    const {id: idUser, role} = req.usuario;
    return this.treatmentsService.update(id, {...data, idUser, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.treatmentsService.remove(id);
  }
}
