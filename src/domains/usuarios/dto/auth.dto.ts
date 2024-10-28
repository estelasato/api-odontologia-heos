import { IsNotEmpty, IsString } from "class-validator";


export class LoginInputDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}

export class UsuarioDto {
  id: string;
  nome?: string;
  email: string;
  role: string;
}

export class LoginOutputDto {
  token: string
  usuario: UsuarioDto
}