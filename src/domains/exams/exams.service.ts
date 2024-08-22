import { Injectable } from '@nestjs/common';
import { Exams } from './dto/ExamsDto';

@Injectable()
export class ExamsService {
  async create(createExamDto: Exams) {
    return 'This action adds a new exam';
  }

  async findAll() {
    return `This action returns all exams`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} exam`;
  }

  async update(id: number, updateExamDto: Exams) {
    return `This action updates a #${id} exam`;
  }

  async remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
