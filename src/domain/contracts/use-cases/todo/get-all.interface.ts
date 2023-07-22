import { ITodo } from '@/domain/entities';

export const GET_ALL_TODOS = Symbol('GetAllTodosUC');

export interface IGetAllTodos {
  getAll: () => Promise<ITodo[]>;
}

export namespace IGetAllTodos {
  export type Output = ITodo[];
}
