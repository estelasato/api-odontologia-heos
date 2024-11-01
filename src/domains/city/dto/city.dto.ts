import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CityDto {
  @IsNotEmpty({ message: 'O campo idEstado é obrigatório.' })
  idEstado: number;

  @IsNotEmpty({ message: 'O campo cidade é obrigatório.' })
  cidade: string;
  
  @IsOptional()
  ddd?: string;

  @IsNumber()
  ativo: number;
}

export class City {
  idEstado: number
  cidade: string
  ddd?: string
  ativo: number

  idUser?: number
  typeUser?: string
}
