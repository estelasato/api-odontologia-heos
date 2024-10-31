import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { AddressDto, AddressType } from "src/shared/dto/address.dto";

export class ResponsibleDto extends AddressDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  nome: string

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

  @IsString()
	celular: string

  @IsOptional()
  @IsString()
	sexo?: string

  @IsOptional()
  @IsString()
	estCivil?: string

  @IsOptional()
  @IsString()
  profissao?: string

  @IsNumber()
  ativo: number

  @IsOptional()
  @IsNumber()
	idCidade?: number
}

export class Responsible extends AddressType{
  nome: string
  cpf?: string
  rg?: string
  dtNascimento?: Date
  email?: string
  celular: string
  sexo?: string
  estCivil?: string
  profissao?: string
  ativo: number
  idCidade?: number

  idUser?: number
  typeUser?: string
}
