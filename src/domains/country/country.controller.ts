import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryDto } from './dto/country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  createCountry(@Body() data: CountryDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.countryService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  getAllCountries() {
    const data = this.countryService.findAll();
    return data;
  }

  @Get(':id')
  getCountryById(@Param('id') id: number) {
    return this.countryService.findOne(+id);
  }

  @Put(':id')
  updateCountry(@Param('id') id: number, @Body() updateCountryDto: CountryDto, @Req() req) {
    const {id: idUser, role} = req.usuario;
    return this.countryService.update(+id, {...updateCountryDto, idUser, typeUser: role});
  }

  @Delete(':id')
  deleteCountry(@Param('id') id: number) {
    return this.countryService.remove(+id);
  }
}
