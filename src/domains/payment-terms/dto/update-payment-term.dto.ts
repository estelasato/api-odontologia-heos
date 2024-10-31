import { PartialType } from '@nestjs/mapped-types';
import { createPaymentTermDto, CreatePaymentTermDto } from './create-payment-term.dto';

export class UpdatePaymentTermDto extends PartialType(CreatePaymentTermDto) {}
export class updatePaymentTermDto extends PartialType(createPaymentTermDto) {}
