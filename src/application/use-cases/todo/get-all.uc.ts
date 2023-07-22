import { Inject } from '@nestjs/common';

import { ITodoRepo, TODO_REPO } from '@/domain/contracts/repos';
import { IGetAllTodos } from '@/domain/contracts/use-cases/todo';

export class GetAllUC implements IGetAllTodos {
  constructor(@Inject(TODO_REPO) private readonly repo: ITodoRepo) {}

  async getAll(): Promise<IGetAllTodos.Output> {
    return this.repo.getAll();
  }
}
