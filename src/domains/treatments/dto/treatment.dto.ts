import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TreatmentDto {
  @IsOptional()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  @IsOptional()
  dataFim: Date;

  @IsOptional()
  @IsString()
  dente?: string;

  @IsNumber()
  idPaciente: number;

  @IsNumber()
  idProfissional: number;

  @IsNumber()
  idAnamnese: number;
}

export class filterTreatmentDto {
  @IsOptional()
  @IsNumber()
  idPaciente?: number;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({value}) => value.split(','))
  idProfissionais?: string[];

  @IsOptional()
  @IsString()
  @IsDateString()
  dataInicial?: Date;

  @IsOptional()
  @IsString()
  @IsDateString()
  dataFinal?: Date;

  @IsOptional()
  @IsNumber()
  idAnamnese?: number;
}

export class TreatmentTypes {
  descricao?: string;
  dataInicio?: Date;
  dataFim?: Date;
  dente?:string;
  idPaciente: number;
  idProfissional: number;
  idAnamnese: number;
}

export class TreatmentFilter {
  idPaciente?: number;
  idProfissionais?: string[];
  dataInicial?: Date;
  dataFinal?: Date;
  idAnamnese?: number;
}
