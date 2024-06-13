import { IsDateString, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AddressDto } from "src/shared/dto/address.dto";

export class CreateEmployeeDto extends AddressDto{
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
	cargo: string

  @IsDecimal()
  salario: string

  @IsString()
  pis: string

  @IsOptional()
  @IsDateString()
  dtAdmissao?: Date

  @IsOptional()
  @IsDateString()
  dtDemissao?: Date

  @IsNumber()
  ativo: number

  @IsOptional()
  @IsNumber()
	idCidade?: number
}

export class CreateEmployee {
  nome: string
  cpf?: string
  rg?: string
  dtNascimento: Date
  email?: string
  celular: string
  sexo: string
  estCivil?: string
  cargo: string
  salario: string
  pis: string
  dtAdmissao?: Date
  dtDemissao?: Date
  ativo: number
  idCidade?: number
}
