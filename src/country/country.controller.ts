import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  createCountry(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
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
  updateCountry(@Param('id') id: number, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  deleteCountry(@Param('id') id: number) {
    return this.countryService.remove(+id);
  }
}
