import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CREATE_TODO, ICreate } from '@/domain/contracts/use-cases/todo';
import { TodoSchema } from '@/infra/entities';
import { CreateTodoInput } from '@/infra/entities/inputs';

@Resolver(() => TodoSchema)
export class TodoMutation {
  constructor(@Inject(CREATE_TODO) private readonly todoService: ICreate) {}

  @Mutation(() => TodoSchema)
  async create(@Args('createTodo') params: CreateTodoInput): Promise<TodoSchema> {
    return this.todoService.create(params);
  }
}
