import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStateDto{
  @IsOptional()
  idPais: Number

  @IsOptional()
  @IsString({ message: 'O campo estado é inválido.' })
  estado: string

  @IsOptional()
  @IsString({ message: 'O campo UF é inválido.' })
  uf: string

  @IsNumber()
  ativo: number

}
