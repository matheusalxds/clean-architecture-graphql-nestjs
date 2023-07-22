import { Module } from '@nestjs/common';

import { GetAllUC, CreateUC } from '@/application/use-cases/todo';
import { GET_ALL_TODOS, CREATE_TODO } from '@/domain/contracts/use-cases/todo';
import { ReposModule } from '@/infra/repos';
import { useClass } from '@/utils';

@Module({
  imports: [ReposModule],
  providers: [useClass(GET_ALL_TODOS, GetAllUC), useClass(CREATE_TODO, CreateUC)],
  exports: [GET_ALL_TODOS, CREATE_TODO],
})
export class UseCasesModule {}
