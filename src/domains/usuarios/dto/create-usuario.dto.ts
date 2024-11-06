import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  senha: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo role é obrigatório.' })
  role?: string;

  @IsOptional()
  @IsNumber()
  ativo?: number;
}
