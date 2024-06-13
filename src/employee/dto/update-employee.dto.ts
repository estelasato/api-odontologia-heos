import { IsDateString, IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";
import { AddressDto, AddressType } from "src/shared/dto/address.dto";

export class UpdateEmployeeDto extends AddressDto {
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
	cargo?: string

  @IsDecimal()
  salario?: string

  @IsString()
  pis?: string

  @IsOptional()
  @IsDateString()
  dtAdmissao?: Date

  @IsOptional()
  @IsDateString()
  dtDemissao?: Date

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
  cargo?: string
  salario?: string
  pis?: string
  dtAdmissao?: Date
  dtDemissao?: Date
  ativo?: number
  idCidade?: number
}
