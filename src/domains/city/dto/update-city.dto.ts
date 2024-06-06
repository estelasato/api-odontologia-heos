import { IsNumber, IsOptional } from "class-validator";

export class UpdateCityDto {
  @IsOptional()
  idEstado: number;

  @IsOptional()
  cidade: string;
  
  @IsOptional()
  ddd: string;

  @IsNumber()
  ativo: number;

}
