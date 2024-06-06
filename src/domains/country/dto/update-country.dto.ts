import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCountryDto {
  @ApiProperty({ type: String, required: false })
  // @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo pais é inválido.' })
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
