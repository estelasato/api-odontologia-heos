import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StatusType {
  AGENDADO,
  // CANCELADO,
  CONFIRMADO,
  EM_ATENDIMENTO,
  REALIZADO,
  NAO_COMPARECEU,
}

export class ScheduleFilterDto {
 @IsOptional()
 idProfissional?: number;

 @IsOptional()
 idPaciente?: number;

  @IsOptional()
  @IsString()
  @IsDateString()
  dataInicial?: Date;

  @IsOptional()
  @IsString()
  @IsDateString()
  dataFinal?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  @IsEnum(StatusType, { each: true, message: '' })
  statusList?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  idPacientes?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  idProfissionais?: string[];
}

export class ScheduleFilter {
  idProfissionais?: string[];
  idPacientes?: string[];
  dataInicial?: Date;
  dataFinal?: Date;
  statusList?: string[];
}

export class ScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  idPaciente: number;

  @IsNotEmpty()
  @IsNumber()
  idProfissional: number;

  @IsNotEmpty()
  @IsDateString()
  horario: Date;

  @IsOptional()
  @IsNumber()
  duracao?: number;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsNotEmpty()
  @IsString()
  status: StatusType;
}

export class ScheduleTypes {
  idPaciente: number;
  idProfissional: number;
  horario: Date | string;
  duracao?: number;
  obs?: string;
  status: StatusType;

  idUser?: number;
  typeUser?: string
}
