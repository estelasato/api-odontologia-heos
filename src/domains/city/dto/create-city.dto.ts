import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCityDto {
  @IsNotEmpty({ message: 'O campo estado_ID é obrigatório.' })
  estado_ID: number;

  @IsNotEmpty({ message: 'O campo cidade é obrigatório.' })
  cidade: string;
  
  @IsOptional()
  ddd: string;

  @IsNumber()
  ativo: number;
}
