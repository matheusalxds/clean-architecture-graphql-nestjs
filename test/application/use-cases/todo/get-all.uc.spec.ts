import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

import { GetAllUC } from '@/application/use-cases/todo';
import { ITodoRepo, TODO_REPO } from '@/domain/contracts/repos';
import { GET_ALL_TODOS, IGetAllTodos } from '@/domain/contracts/use-cases/todo';
import { mockTodo } from '@/test/domain/entities';
import { throwError } from '@/test/utils';
import { useClass, useValue } from '@/utils';

describe('PartnerRepository', () => {
  let mockTodoRepo: MockProxy<ITodoRepo>;
  let createTodoUC: IGetAllTodos;

  beforeAll(async () => {
    mockTodoRepo = mock();

    const app = await Test.createTestingModule({
      providers: [useClass(GET_ALL_TODOS, GetAllUC), useValue(TODO_REPO, mockTodoRepo)],
    }).compile();

    createTodoUC = app.get(GET_ALL_TODOS);
  });

  describe('create()', () => {
    beforeEach(() => mockTodoRepo.getAll.mockResolvedValue([mockTodo()]));

    it('should call TodoRepo with correct params', async () => {
      // ACT
      await createTodoUC.getAll();

      // ASSERT
      expect(mockTodoRepo.getAll).toHaveBeenCalled();
      expect(mockTodoRepo.getAll).toHaveBeenCalledTimes(1);
    });

    it('should throw if TodoRepo throws', async () => {
      // ARRANGE
      const errorMsg = 'any_error';
      mockTodoRepo.getAll.mockRejectedValueOnce(throwError(errorMsg));

      // ACT
      const promise = createTodoUC.getAll();

      // ASSERT
      await expect(promise).rejects.toThrow(new Error(errorMsg));
    });

    it('should returns an array of todos', async () => {
      // ACT
      await createTodoUC.getAll();

      // ASSERT
      expect(mockTodoRepo.getAll).toHaveBeenCalled();
      expect(mockTodoRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
