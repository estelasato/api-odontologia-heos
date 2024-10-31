import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class InstallmentsDto {
  @IsNumber()
  @IsOptional()
  numParcela?: number;

  @IsNumber()
  dias: number;

  @IsNumber()
  perc: number;

  @IsNumber()
  idFormaPag: number;

  @IsNumber()
  idCondPag: number;

  @IsNumber()
  @IsOptional()
  id?: number | null;
}

export class CreatePaymentTermDto {
  @IsString()
  descricao: string;

  @IsNumber()
  @IsOptional()
  desconto?: number;  

  @IsNumber()
  @IsOptional()
  juros?: number;  

  @IsNumber()
  @IsOptional()
  multa?: number;  

  @IsNumber()
  status: number;

  @IsArray()
  parcelas: InstallmentsDto[];
}

export class createPaymentTermDto {
  descricao: string;
  desconto?: number;
  juros?: number;
  multa?: number;
  status: number;
  parcelas: InstallmentsDto[];

  idUser?: number;
  typeUser?: string
}