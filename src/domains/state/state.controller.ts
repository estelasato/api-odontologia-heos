import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  createState(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }

  @Get()
  getAllStates() {
    return this.stateService.findAll();
  }

  @Get(':id')
  getStateById(@Param('id') id: string) {
    return this.stateService.findOne(+id);
  }

  @Put(':id')
  updateState(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  deleteState(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
