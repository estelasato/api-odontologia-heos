import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class StateDto {
  @IsNotEmpty({ message: 'O campo país_ID é obrigatório.' })
  idPais: number

  @IsNotEmpty({ message: 'O campo estado é obrigatório.' })
  @IsString({ message: 'O campo estado é inválido.' })
  estado: string

  @IsOptional()
  @IsString({ message: 'O campo UF é inválido.' })
  uf: string

  @IsNumber()
  ativo: number
}

export class State {
  idPais: number
  estado: string
  uf?: string
  ativo: number
}