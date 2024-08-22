import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TreatmentDto {
  @IsOptional()
  @IsString()
  descricao: string;

  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  @IsOptional()
  dataFim: Date;

  @IsString()
  dente: string;

  @IsNumber()
  idPaciente: number;

  @IsNumber()
  idProfissional: number;

  @IsNumber()
  idAnamnese: number;
}

export class filterTreatmentDto {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({value}) => value.split(','))
  idPacientes?: string[];

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
  dataInicio: Date;
  dataFim?: Date;
  dente:string;
  idPaciente: number;
  idProfissional: number;
  idAnamnese: number;
}

export class TreatmentFilter {
  idPacientes?: string[];
  idProfissionais?: string[];
  dataInicial?: Date;
  dataFinal?: Date;
  idAnamnese?: number;
}
