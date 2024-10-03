import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentTermDto {
  @IsString()
  descricao: string;

  @IsNumber()
  @IsOptional()
  desconto?: number;  

  @IsNumber()
  status: number;
}

export class createPaymentTermDto {
  descricao: string;
  juros?: number;
  multa?: number;
  desconto?: number;
  status: number;
  numParcela: number;
  dias: number;
  perc: number;
  total?: number;
  idFormaPag: number;
}