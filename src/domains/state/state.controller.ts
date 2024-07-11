import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StateService } from './state.service';
import { StateDto } from './dto/state.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  createState(@Body() createStateDto: StateDto) {
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
  updateState(@Param('id') id: string, @Body() updateStateDto: StateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  deleteState(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
