import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStateDto {
  @IsNotEmpty({ message: 'O campo país_ID é obrigatório.' })
  pais_ID: Number

  @IsNotEmpty({ message: 'O campo estado é obrigatório.' })
  @IsString({ message: 'O campo estado é inválido.' })
  estado: string

  @IsOptional()
  @IsString({ message: 'O campo UF é inválido.' })
  uf: string

  @IsNumber()
  ativo: number

}

// estado_ID int NOT NULL PRIMARY KEY IDENTITY,
// pais_ID int NOT NULL,

// estado VARCHAR(56) NOT NULL,
// uf VARCHAR(2) NOT NULL,

// ativo BIT NOT NULL,
// data_cadastro DATETIME NOT NULL,
// data_ult_alt DATETIME NOT NULL,