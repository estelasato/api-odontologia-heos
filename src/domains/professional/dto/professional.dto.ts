import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { AddressDto, AddressType } from "src/shared/dto/address.dto";

export class ProfessionalDto extends AddressDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  nome: string

  @IsOptional()  
  @IsString()
  cpfCnpj?: string

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

  @IsString()
	cro: string
  
  @IsOptional()
  @IsString()
	especialidade?: string
  
  @IsOptional()
  @IsString()
	formacoes?: string
  
  @IsOptional()
  @IsString()
	certificacoes?: string

  @IsNumber()
  ativo: number

  @IsOptional()
  @IsNumber()
	idCidade?: number

  @IsOptional()
  @IsString()
  senha?: string
}

export class Professional extends AddressType{
  nome: string
  cpfCnpj?: string
  rg?: string
  dtNascimento: Date
  email?: string
  celular: string
  sexo: string
  estCivil?: string
  cro: string
  especialidade?: string
  formacoes?: string
  certificacoes?: string
  ativo: number
  idCidade?: number

  senha?: string
  idUser?: number
  typeUser?: string
}
