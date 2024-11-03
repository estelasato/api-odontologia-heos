import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put } from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';

@Controller('procedures')
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  create(@Body() data: CreateProcedureDto, @Req() req) {
    const { id, role} = req.usuario
    return this.proceduresService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.proceduresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idProc: string, @Body() data: UpdateProcedureDto, @Req() req) {
    const { id, role} = req.usuario
    return this.proceduresService.update(+idProc, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proceduresService.remove(+id);
  }
}
