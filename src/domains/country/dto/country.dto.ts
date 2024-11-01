import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CountryDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome é inválido.' })
  pais: string

  @ApiProperty({ type: String, required: false })
  // @IsNotEmpty({ message: 'O campo DDi é obrigatório.' })
  @IsString({ message: 'O campo DDi é inválido.' })
  ddi: string

  @ApiProperty({ type: String, required: false })
  // @IsNotEmpty({ message: 'O campo sigla é obrigatório.' })
  @IsString({ message: 'O campo sigla é inválido.' })
  sigla: string

  @IsNumber()
  ativo: number
}

export class Country {
  pais: string
  ddi?: string
  sigla?: string
  ativo: number

  idUser?: number
  typeUser?: string
}
