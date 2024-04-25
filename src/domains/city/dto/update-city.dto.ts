import { IsNumber, IsOptional } from "class-validator";

export class UpdateCityDto {
  @IsOptional()
  estado_ID: number;

  @IsOptional()
  cidade: string;
  
  @IsOptional()
  ddd: string;

  @IsNumber()
  ativo: number;

}
