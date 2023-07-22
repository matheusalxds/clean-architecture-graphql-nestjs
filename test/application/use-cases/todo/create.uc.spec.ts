import { Test } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';

import { CreateUC } from '@/application/use-cases/todo';
import { ITodoRepo, TODO_REPO } from '@/domain/contracts/repos';
import { CREATE_TODO, ICreate } from '@/domain/contracts/use-cases/todo';
import { CreateTodoInput } from '@/infra/entities/inputs';
import { mockTodo } from '@/test/domain/entities';
import { throwError } from '@/test/utils';
import { useClass, useValue } from '@/utils';

const mockTodoInput = (): CreateTodoInput => ({
  text: 'any_text',
});

describe('PartnerRepository', () => {
  let mockTodoRepo: MockProxy<ITodoRepo>;
  let createTodoUC: ICreate;

  beforeAll(async () => {
    mockTodoRepo = mock();

    const app = await Test.createTestingModule({
      providers: [useClass(CREATE_TODO, CreateUC), useValue(TODO_REPO, mockTodoRepo)],
    }).compile();

    createTodoUC = app.get(CREATE_TODO);
  });

  describe('create()', () => {
    beforeEach(() => mockTodoRepo.create.mockResolvedValue(mockTodo()));

    it('should call TodoRepo with correct params', async () => {
      // ARRANGE
      const input = mockTodoInput();

      // ACT
      await createTodoUC.create(input);

      // ASSERT
      expect(mockTodoRepo.create).toHaveBeenCalledWith(input);
      expect(mockTodoRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw if TodoRepo throws', async () => {
      // ARRANGE
      const errorMsg = 'any_error';
      mockTodoRepo.create.mockRejectedValueOnce(throwError(errorMsg));

      // ACT
      const promise = createTodoUC.create(mockTodoInput());

      // ASSERT
      await expect(promise).rejects.toThrow(new Error(errorMsg));
    });

    it('should returns ', async () => {
      // ARRANGE
      const errorMsg = 'any_error';
      mockTodoRepo.create.mockRejectedValueOnce(throwError(errorMsg));

      // ACT
      const promise = createTodoUC.create(mockTodoInput());

      // ASSERT
      await expect(promise).rejects.toThrow(new Error(errorMsg));
    });
  });
});
