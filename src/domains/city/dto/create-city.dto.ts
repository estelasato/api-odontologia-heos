import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateCityDto {
  @IsNotEmpty({ message: 'O campo idEstado é obrigatório.' })
  idEstado: number;

  @IsNotEmpty({ message: 'O campo cidade é obrigatório.' })
  cidade: string;
  
  @IsOptional()
  ddd: string;

  @IsNumber()
  ativo: number;
}
