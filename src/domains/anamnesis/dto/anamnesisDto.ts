import { IsNumber, IsOptional, IsString } from "class-validator";

export class AnamnesisDto {
  @IsOptional()
  @IsString()
  queixas?: string;

  @IsOptional()
  @IsString()
  obs?: string;

  @IsNumber()
  idPaciente: number;
}

export class AnamnesisFilterDto {
  @IsOptional()
  @IsNumber()
  idPaciente?: number;
}

export class AnamnesisTypes {
  queixas?: string;
  obs?: string;
  idPaciente: number;
}

export class AnamnesisFilter {
  idPaciente?: number;
}
