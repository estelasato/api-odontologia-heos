import { IsBoolean, IsNumber } from "class-validator";

export class CreateInstallmentDto {
  @IsNumber()
  numParcela: number;
  
  @IsNumber()
  dias: number;

  @IsNumber()
  perc: number;

  @IsNumber()
  percTotatl: number;

  // @IsNumber()
  // status?: number
  @IsNumber()
  idFormaPag: number;

  @IsNumber()
  idCondPag: number;
}
