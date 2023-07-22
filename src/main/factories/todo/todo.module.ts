import { Module } from '@nestjs/common';

import { TodoMutation } from '@/infra/graphql/todo/mutations';
import { TodoResolver } from '@/infra/graphql/todo/queries';
import { UseCasesModule } from '@/main/factories/todo/usecases';

@Module({
  imports: [UseCasesModule],
  providers: [TodoResolver, TodoMutation],
})
export class TodoModule {}
