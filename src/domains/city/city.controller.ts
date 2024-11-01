import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common';
import { CityService } from './city.service';
import { CityDto } from './dto/city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  createCity(@Body() data: CityDto, @Req() req: any) {
    const {id, role} = req.usuario;
    return this.cityService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAllCities() {
    return this.cityService.findAll();
  }

  @Get('/cep/:id')
  findCEP(@Param('id') id: string) {
    return this.cityService.findCEP(+id);
  }

  @Get(':id')
  getCityById(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Put(':id')
  updateCity(@Param('id') idCity: string, @Body() data: CityDto, @Req() req: any) {
    const {id, role} = req.usuario;
    return this.cityService.update(+idCity, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  deleteCity(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
