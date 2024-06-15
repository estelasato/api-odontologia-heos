import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { IllnessService } from './illness.service';
import { BasicFormDto } from 'src/shared/dto/basicForm.dto';

@Controller('illness')
export class IllnessController {
  constructor(private readonly illnessService: IllnessService) {}

  @Post()
  create(@Body() data: BasicFormDto) {
    return this.illnessService.create(data);
  }

  @Get()
  findAll() {
    return this.illnessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.illnessService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: BasicFormDto) {
    return this.illnessService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.illnessService.remove(id);
  }
}
