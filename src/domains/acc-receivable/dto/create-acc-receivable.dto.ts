import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";


export enum ISituation {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  CANCELADO = 'CANCELADO',
}
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
  idServico: number;

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
  @IsString()
  situacao?: ISituation

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
  idServico: number;
  idProfissional: number;

  idFormaPag: number;
  obs?: string;
  parcela: number;
  desconto?: number;
  multa?: number;
  juros?: number;
  valorParcela: number;
  valorRecebido?: number;
  situacao?: ISituation;
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
  idServico?: number;

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
  idServico?: number;
  idFormaPag?: number;
  idProfissional?: number;
  situacao?: number;
  dtVencimento?: Date;
  dtRecebimento?: Date;
  dtCancelamento?: Date;
}
