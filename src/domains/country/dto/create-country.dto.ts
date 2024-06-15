import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCountryDto {
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

  // @ApiProperty({ type: Number, required: false })
  // @IsNotEmpty({ message: 'O campo sigla é obrigatório.' })
  // @IsString({ message: 'O campo ativo é inválido.' })
  @IsNumber()
  ativo: number

  // @ApiProperty({ type: String, required: false })
  // // @IsNotEmpty({ message: 'O campo sigla é obrigatório.' })
  // @IsDate({ message: 'O campo dtCadastro é inválido.' })
  // dtCadastro: Date

  // @ApiProperty({ type: String, required: false })
  // // @IsNotEmpty({ message: 'O campo sigla é obrigatório.' })
  // @IsDate({ message: 'O campo dtUltAlt é inválido.' })
  // dtUltAlt: Date
}
