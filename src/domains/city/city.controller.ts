import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAllCities() {
    return this.cityService.findAll();
  }

  @Get(':id')
  getCityById(@Param('id') id: string) {
    return this.cityService.findOne(+id);
  }

  @Put(':id')
  updateCity(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(+id, updateCityDto);
  }

  @Delete(':id')
  deleteCity(@Param('id') id: string) {
    return this.cityService.remove(+id);
  }
}
