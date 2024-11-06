import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Req } from '@nestjs/common';
import { AccReceivableService } from './acc-receivable.service';
import { CreateAccReceivableDto, FilterAccReceivableDto } from './dto/create-acc-receivable.dto';
import { UpdateAccReceivableDto } from './dto/update-acc-receivable.dto';
import { AllowPublicAccess } from 'src/shared/decorators/allow-public-access.decorator';

@Controller('acc-receivable')
export class AccReceivableController {
  constructor(private readonly accReceivableService: AccReceivableService) {}

  @Post()
  create(@Body() data: CreateAccReceivableDto, @Req() req: any) {
    const {id, role} = req.usuario;
    return this.accReceivableService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll( @Query() filter: FilterAccReceivableDto) {
    return this.accReceivableService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accReceivableService.findOne(+id);
  }

  @Patch(':id')
  markAsPaid(@Param('id') id: string, @Req () req: any) {
    const {id: idUser, role: typeUser} = req.usuario;
    return this.accReceivableService.markAsPaid(+id, idUser, typeUser);
  }

  @Put(':id')
  update(@Param('id') idAcc: string, @Body() data: UpdateAccReceivableDto, @Req() req: any) {
    const {id, role} = req.usuario;
    return this.accReceivableService.update(+idAcc, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accReceivableService.remove(+id);
  }
}
