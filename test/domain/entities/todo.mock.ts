import { ITodo, TodoStatus } from '@/domain/entities';
import { mockUser } from '@/test/domain/entities/user.mock';

export const mockTodo = (): ITodo => ({
  id: '81bd0f50-274f-11ee-be56-0242ac120002',
  createdAt: new Date().toISOString(),
  status: TodoStatus.PENDING,
  text: 'any_text',
  user: mockUser(),
});
