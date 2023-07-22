import { Repository } from 'typeorm';

import { ITodoRepo } from '@/domain/contracts/repos';
import { TodoStatus } from '@/domain/entities';
import { TodoSchema, UserSchema } from '@/infra/entities';
import { CreateTodoInput } from '@/infra/entities/inputs';
import { TodoRepo } from '@/infra/repos';
import { PgTestHelper } from '@/test/infra/utils';

const mockTodo = (): CreateTodoInput => ({
  text: 'any_text',
});

describe('PartnerRepository', () => {
  let repository: Repository<TodoSchema>;
  let repo: ITodoRepo;

  beforeAll(async () => {
    await PgTestHelper.connect([TodoSchema, UserSchema]);
    repository = PgTestHelper.getRepository(TodoSchema);
  });

  beforeEach(async () => {
    await PgTestHelper.restore();
    repo = new TodoRepo(repository);
  });

  afterAll(async () => {
    await PgTestHelper.disconnect();
  });

  describe('create()', () => {
    it('should returns the created partner on success', async () => {
      const input = mockTodo();

      // ACT
      const todo = await repo.create(input);

      // ASSERT
      expect(todo).toBeTruthy();
      expect(todo.id).toBeTruthy();
      expect(todo.text).toBe(input.text);
      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.createdAt).toBeTruthy();
    });
  });

  describe('getAll()', () => {
    it('should returns an array of todos', async () => {
      // ARRANGE
      const todo = mockTodo();
      await repository.save([todo, todo]);

      // ACT
      const todos = await repo.getAll();

      // ASSERT
      expect(todos).toHaveLength(2);
      expect(todos[0].id).toBeTruthy();
      expect(todos[1].id).toBeTruthy();
      expect(todos[0].text).toBe(todo.text);
      expect(todos[1].text).toBe(todo.text);
      expect(todos[0].status).toBe(TodoStatus.PENDING);
      expect(todos[1].status).toBe(TodoStatus.PENDING);
      expect(todos[0].createdAt).toBeTruthy();
      expect(todos[1].createdAt).toBeTruthy();
    });

    it('should returns an empty array if no todo exists', async () => {
      // ACT
      const todos = await repo.getAll();

      // ASSERT
      expect(todos).toHaveLength(0);
    });
  });
});
