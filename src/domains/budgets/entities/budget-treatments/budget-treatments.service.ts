import { Inject, Injectable } from '@nestjs/common';
import * as sql from 'mssql';

export class BudgetTreatmentsType {
  id?: number;
  idOrcamento: number;
  idTratamento: number;
  obs?: string;
  total?: number;
}

@Injectable()
export class BudgetTreatmentsService {
  constructor(
    @Inject('SQL_CONNECTION')
    private readonly sqlCon: sql.ConnectionPool,
  ) {}

}
