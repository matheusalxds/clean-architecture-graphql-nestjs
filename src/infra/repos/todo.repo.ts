import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ITodoRepo } from '@/domain/contracts/repos';
import { ICreate } from '@/domain/contracts/use-cases/todo';
import { ITodo } from '@/domain/entities';
import { TodoSchema } from '@/infra/entities';

export class TodoRepo implements ITodoRepo {
  constructor(@InjectRepository(TodoSchema) private readonly repo: Repository<TodoSchema>) {}

  async getAll(): Promise<ITodo[]> {
    return this.repo.find();
  }

  async create({ text }: ICreate.Input): Promise<ICreate.Output> {
    return this.repo.save({ text });
  }
}
