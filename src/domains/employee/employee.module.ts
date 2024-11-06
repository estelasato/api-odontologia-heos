import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DatabaseModule } from 'src/db.module';
import { CityModule } from '../city/city.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [DatabaseModule, CityModule, UsuariosModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
