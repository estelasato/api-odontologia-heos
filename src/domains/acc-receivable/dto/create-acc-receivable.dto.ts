import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAccReceivableDto {
  @IsOptional()
  @IsNumber()
  id?: number;
    // opcionais (vao pegar do orcamento)
  @IsOptional()
  @IsNumber()
  idPaciente: number;

  @IsOptional()
  @IsNumber()
  idOrcamento: number;

  @IsOptional()
  @IsNumber()
  idProfissional: number;


  @IsNumber()
  idFormaPag: number;

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
  @IsNumber()
  situacao?: number

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
  // opcionais (vao pegar do orcamento)
  id?: number;
  idPaciente: number;
  idOrcamento: number;
  idProfissional: number;

  idFormaPag: number;
  obs?: string;
  parcela: number;
  desconto?: number;
  multa?: number;
  juros?: number;
  valorParcela: number;
  valorRecebido?: number;
  situacao?: number;
  dtVencimento: Date;
  dtRecebimento?: Date;
  dtCancelamento?: Date;

  idUser?: number;
  typeUser?: string;
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
  @IsNumber()
  situacao?: number

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
  situacao?: number;
  dtVencimento?: Date;
  dtRecebimento?: Date;
  dtCancelamento?: Date;
}
