import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAccReceivableDto, createAccReceivableDto, FilterAccReceivableDto } from "src/domains/acc-receivable/dto/create-acc-receivable.dto";

export class BudgetTreatmentDto{
  @IsOptional()
  @IsNumber()
  id?: number;

  // @IsNumber()
  // idOrcamento: number;

  @IsNumber()
  idTratamento: number;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsNumber()
  qtd: number;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsNumber()
  valor?: number;
}

export class budgetTreatmentDto{
  id?: number;
  idTratamento: number;
  obs?: string;
  qtd: number;
  total?: number;
  valor?: number;
}

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
  idCondPagamento: number;

  @IsArray()
  tratamentos: BudgetTreatmentDto[];

  @IsArray()
  contasReceber: CreateAccReceivableDto[];
}

export class createBudgetDto {
  total?: number;
  status?: string;
  idAnamnese: number;
  idPaciente: number;
  idProfissional: number;
  idCondPagamento: number;

  tratamentos: budgetTreatmentDto[];
  contasReceber: createAccReceivableDto[]
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
