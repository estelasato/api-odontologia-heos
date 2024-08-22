import { IsOptional, IsString } from "class-validator";

export class ExamsDto {
  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}

export class Exams {
  nome: string;
  descricao?: string;
}
