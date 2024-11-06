import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProcedureDto {

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao: string;
  
  @IsNumber()
  @IsOptional()
  valor: number;

  @IsNumber()
  @IsNotEmpty()
  ativo: number;

}

export interface createProcedureDto extends ILastUserUpdated {
  nome: string;
  descricao?: string;
  valor?: number;
  ativo: number;
}
