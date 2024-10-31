import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  create(@Body() data: CreatePaymentMethodDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.paymentMethodsService.create({...data, idUser: id, typeUser: role});
  }

  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') idPM: string, @Body() data: UpdatePaymentMethodDto, @Req() req) {
    const {id, role} = req.usuario;
    return this.paymentMethodsService.update(+idPM, {...data, idUser: id, typeUser: role});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodsService.remove(+id);
  }
}
