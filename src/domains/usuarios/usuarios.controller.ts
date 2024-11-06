import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AllowPublicAccess } from 'src/shared/decorators/allow-public-access.decorator';
import { LoginInputDto, LoginOutputDto } from './dto/auth.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Authenticated } from 'src/shared/decorators/authenticated.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @AllowPublicAccess()
  @Post('login')
  public async login(@Body() body: LoginInputDto): Promise<LoginOutputDto> {
    return this.usuariosService.login(body)
  }

  @AllowPublicAccess()
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<any> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usuariosService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
  //   return this.usuariosService.update(+id, updateUsuarioDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
