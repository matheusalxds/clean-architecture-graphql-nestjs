import { ICreate } from '@/domain/contracts/use-cases/todo';
import { ITodo } from '@/domain/entities';

export const TODO_REPO = Symbol('TodoRepo');

export interface ITodoRepo {
  getAll: () => Promise<ITodo[]>;
  create: (params: ICreate.Input) => Promise<ICreate.Output>;
}
