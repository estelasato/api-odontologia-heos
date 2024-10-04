import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PaymentTermsService } from './payment-terms.service';
import { CreatePaymentTermDto } from './dto/create-payment-term.dto';
import { UpdatePaymentTermDto } from './dto/update-payment-term.dto';

@Controller('payment-terms')
export class PaymentTermsController {
  constructor(private readonly paymentTermsService: PaymentTermsService) {}

  @Post()
  create(@Body() data: CreatePaymentTermDto) {
    return this.paymentTermsService.create(data);
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
  update(@Param('id') id: number, @Body() updatePaymentTermDto: UpdatePaymentTermDto) {
    return this.paymentTermsService.update(Number(id), updatePaymentTermDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentTermsService.remove(+id);
  }
}
