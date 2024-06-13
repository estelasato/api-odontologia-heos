import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
	logradouro?: string;

  @IsOptional()
  @IsString()
	bairro?: string;

  @IsOptional()
  @IsNumber()
	numero?: number;

  @IsOptional()
  @IsString()
	complemento?: string;
}

export class AddressType{
  cep?: string;
  logradouro?: string;
  bairro?: string;
  numero?: number;
  complemento?: string;
}