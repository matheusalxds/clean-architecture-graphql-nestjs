import { ITodo } from './todo';

export interface IUser {
  id: string;
  username: string;
  password: string;
  todos?: ITodo[];
}
