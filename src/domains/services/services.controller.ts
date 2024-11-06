import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() data: CreateServiceDto, @Req() req) {
    const  {id, role} = req.usuario;
    return this.servicesService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idService: string, @Body() data: UpdateServiceDto, @Req() req) {
    const  {id, role} = req.usuario;
    return this.servicesService.update(+idService, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
