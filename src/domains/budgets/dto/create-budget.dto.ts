import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAccReceivableDto, createAccReceivableDto, FilterAccReceivableDto } from "src/domains/acc-receivable/dto/create-acc-receivable.dto";

export class BudgetProcedureDto{
  @IsOptional()
  @IsNumber()
  id?: number;

  // @IsNumber()
  // idOrcamento: number;

  @IsNumber()
  idProcedimento: number;

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

export class budgetProcedureDto{
  id?: number;
  idProcedimento: number;
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
  @IsOptional()
  percDesconto?: number;

  @IsString()
  @IsOptional()
  obs?: string;

  @IsNumber()
  idPaciente: number;

  @IsNumber()
  idProfissional: number;

  @IsArray()
  procedimentos: BudgetProcedureDto[];

}

export class createBudgetDto {
  total?: number;
  status?: string;
  percDesconto?: number;
  obs?: string;
  idPaciente: number;
  idProfissional: number;
  // idCondPagamento: number;

  procedimentos: budgetProcedureDto[];
  // contasReceber: createAccReceivableDto[];

  idUser?: number;
  typeUser?: string;
}

export class BudgetFilterDto {
  @IsOptional()
  idPaciente?: number;

  @IsString()
  @IsOptional()
  status?: string;

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
  idProfissional?: number;
  dataInicial?: Date;
  dataFinal?: Date;
  status?: string;
}
