import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class IllnessAnamnesisDto {
  @IsNumber()
  idDoenca: number;

  @IsNumber()
  idAnamnese: number;

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

export class IllnessAnamnesisTypes {
  idDoenca: number;
  idAnamnese: number;
  obs?: string;
  gravidade?: string;
  cronica?: boolean;
  complicacoes?: string;
  tratamento?: string;
}