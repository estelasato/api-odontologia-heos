import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBudgetDto {
  @IsNumber()
  @IsOptional()
  total?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  idAnamnese: number;

  @IsNumber()
  idPaciente: number;

  @IsNumber()
  idProfissional: number;

  @IsNumber()
  @IsOptional()
  idCondPagamento?: number;
}

export class createBudgetDto {
  total?: number;
  status?: string;
  idAnamnese: number;
  idPaciente: number;
  idProfissional: number;
  idCondPagamento?: number;
}

export class BudgetFilterDto {
  @IsOptional()
  idPaciente?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  idAnamnese?: number;

  @IsOptional()
  idProfissional?: number;

  @IsDateString()
  @IsOptional()
  dataInicial?: Date;

  @IsDateString()
  @IsOptional()
  dataFinal?: Date;
}

export class budgetFilter {
  idPaciente?: number;
  idAnamnese?: number;
  idProfissional?: number;
  dataInicial?: Date;
  dataFinal?: Date;
  status?: string;
}
