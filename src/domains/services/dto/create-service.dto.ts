import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateAccReceivableDto, createAccReceivableDto } from "src/domains/acc-receivable/dto/create-acc-receivable.dto";

export class CreateServiceDto {
  @IsNumber()
  valor: number;

  @IsString()
  @IsOptional()
  obs?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  idCondPagamento: number;

  @IsNumber()
  idOrcamento: number;

  @IsNumber()
  idPaciente: number;

  @IsArray()
  contasReceber: CreateAccReceivableDto[];

}

export class createServiceDto {
  valor: number;
  obs?: string;
  status?: string;
  idCondPagamento: number;
  idOrcamento: number;
  idPaciente: number;
  contasReceber: createAccReceivableDto[];


  idUser: number;
  typeUser: string;
}
