import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TODO_REPO } from '@/domain/contracts/repos';
import { TodoSchema } from '@/infra/entities';
import { TodoRepo } from '@/infra/repos/todo.repo';
import { useClass } from '@/utils';

@Module({
  imports: [TypeOrmModule.forFeature([TodoSchema])],
  providers: [useClass(TODO_REPO, TodoRepo)],
  exports: [TODO_REPO],
})
export class ReposModule {}
