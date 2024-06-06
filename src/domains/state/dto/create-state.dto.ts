import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStateDto {
  @IsNotEmpty({ message: 'O campo país_ID é obrigatório.' })
  idPais: Number

  @IsNotEmpty({ message: 'O campo estado é obrigatório.' })
  @IsString({ message: 'O campo estado é inválido.' })
  estado: string

  @IsOptional()
  @IsString({ message: 'O campo UF é inválido.' })
  uf: string

  @IsNumber()
  ativo: number

}

// idEstado int NOT NULL PRIMARY KEY IDENTITY,
// idPais int NOT NULL,

// estado VARCHAR(56) NOT NULL,
// uf VARCHAR(2) NOT NULL,

// ativo BIT NOT NULL,
// dtCadastro DATETIME NOT NULL,
// dtUltAlt DATETIME NOT NULL,