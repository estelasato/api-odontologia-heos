import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAccReceivableDto {

  @IsNumber()
  idPaciente: number;

  @IsNumber()
  idOrcamento: number;

  @IsNumber()
  idFormaPag: number;

  @IsNumber()
  idProfissional: number;

  @IsOptional()
  @IsString()
  obs?: string

  @IsNumber()
  parcela: number;

  @IsOptional()
  @IsNumber()
  desconto?: number;

  @IsOptional()
  @IsNumber()
  multa?: number;

  @IsOptional()
  @IsNumber()
  juros?: number;

  @IsNumber()
  valorParcela: number;	

  @IsNumber()
  valorRecebido?: number;

  @IsOptional()
  @IsString()
  situacao?: string

  @IsDate()
  dtVencimento: Date;

  @IsDate()
  @IsOptional()
  dtRecebimento?: Date;

  @IsDate()
  @IsOptional()
  dtCancelamento?: Date;
}

export class createAccReceivableDto {
  idPaciente: number;
  idOrcamento: number;
  idFormaPag: number;
  idProfissional: number;
  obs?: string;
  parcela: number;
  desconto?: number;
  multa?: number;
  juros?: number;
  valorParcela: number;
  valorRecebido?: number;
  situacao?: string;
  dtVencimento: Date;
  dtRecebimento?: Date;
  dtCancelamento?: Date;
}

export class FilterAccReceivableDto {
  @IsOptional()
  @IsNumber()
  idPaciente?: number;

  @IsOptional()
  @IsNumber()
  idOrcamento?: number;

  @IsOptional()
  @IsNumber()
  idFormaPag?: number;

  @IsOptional()
  @IsNumber()
  idProfissional?: number;

  // @IsOptional()
  // @IsNumber()
  // parcela?: number;

  // @IsOptional()
  // @IsNumber()
  // desconto?: number;

  // @IsOptional()
  // @IsNumber()
  // multa?: number;

  // @IsOptional()
  // @IsNumber()
  // juros?: number;

  // @IsOptional()
  // @IsNumber()
  // valorParcela?: number;	

  // @IsOptional()
  // @IsNumber()
  // valorRecebido?: number;

  @IsOptional()
  @IsString()
  situacao?: string

  @IsOptional()
  @IsDate()
  dtVencimento?: Date;

  @IsOptional()
  @IsDate()
  dtRecebimento?: Date;

  @IsOptional()
  @IsDate()
  dtCancelamento?: Date;
}

export class filterAccReceivableDto {
  idPaciente?: number;
  idOrcamento?: number;
  idFormaPag?: number;
  idProfissional?: number;
  situacao?: string;
  dtVencimento?: Date;
  dtRecebimento?: Date;
  dtCancelamento?: Date;
}
