import { ITodo } from '@/domain/entities';

export const CREATE_TODO = Symbol('CreateUC');

export interface ICreate {
  create: (params: ICreate.Input) => Promise<ICreate.Output>;
}

export namespace ICreate {
  export type Input = Pick<ITodo, 'text'>;
  export type Output = ITodo;
}
