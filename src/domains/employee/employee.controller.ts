import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() data: CreateEmployeeDto) {
    return this.employeeService.create(data);
  }

  @Get(':id')
  getCityById(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }


  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateEmployeeDto) {
    return this.employeeService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}
