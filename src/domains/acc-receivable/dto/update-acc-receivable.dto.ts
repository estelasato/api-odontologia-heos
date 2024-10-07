import { PartialType } from '@nestjs/mapped-types';
import { createAccReceivableDto, CreateAccReceivableDto } from './create-acc-receivable.dto';

export class UpdateAccReceivableDto extends PartialType(CreateAccReceivableDto) {}
export class updateAccReceivableDto extends PartialType(createAccReceivableDto) {}
