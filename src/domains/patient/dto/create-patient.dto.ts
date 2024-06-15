import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { AddressDto, AddressType } from "src/shared/dto/address.dto"

export class CreatePatientDto extends AddressDto{
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  nome: string

  @IsOptional()  
  @IsString()
  cpf?: string

  @IsOptional()
  @IsString()
  rg?: string

  @IsDateString()
  dtNascimento: Date

  @IsOptional()
  @IsString()
  email?: string

  @IsString()
	celular: string

  @IsString()
	sexo: string

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

  @IsNumber()
  ativo: number

  @IsOptional()
  @IsNumber()
	idCidade?: number
}

export class CreatePatient extends AddressType{
  nome: string
  cpf?: string
  rg?: string
  dtNascimento: Date
  email?: string
  celular: string
  sexo: string
  estCivil?: string
  obs?: string
  profissao?: string
  indicacao?: string
  ativo: number
  idCidade?: number
}
