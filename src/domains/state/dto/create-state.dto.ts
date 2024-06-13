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