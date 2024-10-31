import { PartialType } from '@nestjs/mapped-types';
import { createPaymentMethodDto, CreatePaymentMethodDto } from './create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {}
export class updatePaymentMethodDto extends PartialType(createPaymentMethodDto) {}

