import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

class medAnamnesisDto {
  @IsNumber()
  @IsOptional()
  idMedicamento?: number;

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  dosagem?: string;

  @IsString()
  @IsOptional()
  frequencia?: string;

  @IsString()
  @IsOptional()
  motivo?: string;

  @IsString()
  @IsOptional()
  obs?: string;
}
class allergyAnamnesisDto {
  @IsNumber()
  @IsOptional()
  idAlergia?: number;

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  obs?: string;

  @IsString()
  @IsOptional()
  gravidade?: string;

  @IsString()
  @IsOptional()
  complicacoes?: string;

  @IsString()
  @IsOptional()
  tratamento?: string;
}

export class IllnessAnamnesisDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsOptional()
  idDoenca?: number;

  @IsString()
  @IsOptional()
  obs?: string;

  @IsString()
  @IsOptional()
  gravidade?: string;

  @IsBoolean()
  @IsOptional()
  cronica?: boolean;

  @IsString()
  @IsOptional()
  complicacoes?: string;

  @IsString()
  @IsOptional()
  tratamento?: string;
}

export class AnamnesisDto {
  @IsOptional()
  @IsString()
  queixas?: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsNumber()
  idPaciente: number;

  @IsArray()
  @IsOptional()
  doencas?: IllnessAnamnesisDto[];

  @IsArray()
  @IsOptional()
  alergias?: allergyAnamnesisDto[];

  @IsArray()
  @IsOptional()
  medicamentos?: medAnamnesisDto[];
}

export class AnamnesisFilterDto {
  @IsOptional()
  // @IsNumber()
  idPaciente?: any;

  @IsDateString()
  @IsOptional()
  dataInicial?: Date;

  @IsDateString()
  @IsOptional()
  dataFinal?: Date;

  @IsOptional()
  @IsNumber()
  idAnamnese?: number;
}

export class AnamnesisTypes {
  queixas?: string;
  obs?: string;
  idPaciente: number;
  alergias?: allergyAnamnesisDto[];
  doencas?: IllnessAnamnesisDto[];
  medicamentos?: medAnamnesisDto[];

  idUser?: number;
  typeUser?: string
}

export class AnamnesisFilter {
  idPaciente?: number;
  dataInicial?: Date;
  dataFinal?: Date;
  idAnamnese?: number;
}
