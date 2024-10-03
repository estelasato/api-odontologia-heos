import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentMethodDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  status: number;

  @IsString()
  @IsOptional()
  descricao?: string;
}

export class createPaymentMethodDto {
  id?: number;
  status: number;
  descricao?: string;
}
