import { PartialType } from '@nestjs/mapped-types';
import { createServiceDto, CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
export class updateServiceDto extends PartialType(createServiceDto) {}
