import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { DatabaseModule } from 'src/db.module';
import { CityModule } from '../city/city.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [DatabaseModule, CityModule, UsuariosModule],
  controllers: [ProfessionalController],
  providers: [ProfessionalService],
})
export class ProfessionalModule {}
