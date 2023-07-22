import { Inject } from '@nestjs/common';

import { ITodoRepo, TODO_REPO } from '@/domain/contracts/repos';
import { ICreate } from '@/domain/contracts/use-cases/todo';

export class CreateUC implements ICreate {
  constructor(@Inject(TODO_REPO) private readonly repo: ITodoRepo) {}

  async create(params: ICreate.Input): Promise<ICreate.Output> {
    return this.repo.create(params);
  }
}
