import { IUser } from './user';

export enum TodoStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface ITodo {
  id: string;
  text: string;
  status: TodoStatus;
  createdAt: string;
  user: IUser;
}
