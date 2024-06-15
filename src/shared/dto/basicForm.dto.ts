import { IsNumber, IsOptional, IsString } from "class-validator";

export class BasicFormDto {
  @IsString({ message: 'O campo nome é inválido.' })
  nome: string

  @IsOptional()
  @IsString({ message: 'O campo descrição é inválido.' })
  descricao?: string

  @IsNumber()
  ativo: number

}

export class BasicFormTypes {
  nome: string
  descricao?: string
  ativo: number
}
