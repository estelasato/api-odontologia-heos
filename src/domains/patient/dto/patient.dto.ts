import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { AddressDto, AddressType } from "src/shared/dto/address.dto"

export class IncludeIds {
  id?: number;
}

export class PatientDto extends AddressDto{
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

  @IsOptional()
  @IsString()
	celular?: string

  @IsString()
	sexo: string

  @IsOptional()
  @IsString()
	estCivil?: string

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

  @IsOptional()
  @IsArray()
  responsaveis?: IncludeIds[]

  @IsOptional()
  @IsArray()
  habitos?: IncludeIds[]
}

export class Patient extends AddressType{
  nome: string
  cpf?: string
  rg?: string
  dtNascimento: Date
  email?: string
  celular?: string
  sexo: string
  estCivil?: string
  profissao?: string
  indicacao?: string
  ativo: number
  idCidade?: number

  responsaveis?: IncludeIds[]
  habitos?: IncludeIds[]

}
