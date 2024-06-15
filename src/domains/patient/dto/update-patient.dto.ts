import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { AddressDto, AddressType } from 'src/shared/dto/address.dto';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto extends AddressDto {
  @IsOptional()  
  @IsString()
  nome?: string

  @IsOptional()  
  @IsString()
  cpf?: string

  @IsOptional()
  @IsString()
  rg?: string

  @IsOptional()  
  @IsDateString()
  dtNascimento?: Date

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
	celular?: string

  @IsOptional()
  @IsString()
	sexo?: string

  @IsOptional()
  @IsString()
	estCivil?: string

  @IsOptional()
  @IsString()
	obs?: string

  @IsOptional()
  @IsString()
	profissao?: string

  @IsOptional()
  @IsString()
	indicacao?: string

  @IsOptional()
  @IsNumber()
  ativo?: number

  @IsOptional()
  @IsNumber()
	idCidade?: number
}

export class UpdateEmployee extends AddressType {
  nome?: string
  cpf?: string
  rg?: string
  dtNascimento?: Date
  email?: string
  celular?: string
  sexo?: string
  estCivil?: string
  obs?: string
  profissao?: string
  indicacao?: string
  ativo?: number
  idCidade?: number
}


