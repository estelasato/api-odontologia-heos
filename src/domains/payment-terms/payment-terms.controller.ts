import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { PaymentTermsService } from './payment-terms.service';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';

@Controller('payment-terms')
export class PaymentTermsController {
  constructor(private readonly paymentTermsService: PaymentTermsService) {}

  @Post()
  create(@Body() data: CreatePaymentTermDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.paymentTermsService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.paymentTermsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTermsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idPT: number, @Body() data: UpdatePaymentTermDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.paymentTermsService.update(Number(idPT), {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTermsService.remove(+id);
  }
}
