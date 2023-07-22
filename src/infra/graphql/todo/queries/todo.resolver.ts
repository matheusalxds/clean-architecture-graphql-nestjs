import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GET_ALL_TODOS, IGetAllTodos } from '@/domain/contracts/use-cases/todo';
import { TodoSchema } from '@/infra/entities';

@Resolver(() => TodoSchema)
export class TodoResolver {
  constructor(@Inject(GET_ALL_TODOS) private readonly todoService: IGetAllTodos) {}

  @Query(() => [TodoSchema])
  async getAll(): Promise<TodoSchema[]> {
    return this.todoService.getAll();
  }
}
