import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { StateService } from './state.service';
import { StateDto } from './dto/state.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  createState(@Body() data: StateDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.stateService.create({...data, idUser: id, typeUser: role});
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
  updateState(@Param('id') idState: string, @Body() data: StateDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.stateService.update(+idState, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  deleteState(@Param('id') id: string) {
    return this.stateService.remove(+id);
  }
}
