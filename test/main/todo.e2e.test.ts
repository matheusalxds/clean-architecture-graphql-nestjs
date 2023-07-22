import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';

import { TodoStatus } from '@/domain/entities';
import { TodoSchema, UserSchema } from '@/infra/entities';
import { AppModule } from '@/main/factories/app.module';
import { mockTodo, mockUser } from '@/test/domain/entities';
import { getData, getErrorMsg, getStatusCode, PgTestHelper } from '@/test/infra/utils';

const gql = '/graphql';
const respFragment = `id, text, status`;

describe('Todos (e2e)', () => {
  let app: INestApplication;
  let todoRepo: Repository<TodoSchema>;
  let userRepo: Repository<UserSchema>;

  beforeAll(async () => {
    await PgTestHelper.connect([TodoSchema, UserSchema]);
    todoRepo = PgTestHelper.getRepository(TodoSchema);
    userRepo = PgTestHelper.getRepository(UserSchema);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(PgTestHelper.connection)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await PgTestHelper.disconnect();
    await app.close();
  });

  describe('query', () => {
    describe('getAll {}', () => {
      it('should returns an array of todos', async () => {
        // ARRANGE
        const user = mockUser();
        const todo = mockTodo();
        await userRepo.save(user);
        await todoRepo.save([todo]);

        // ACT
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query {
            getAll { ${respFragment} }
          }`,
          })
          .expect(200)
          .expect((res) => {
            expect(getData(res).getAll).toEqual([
              {
                id: todo.id,
                status: TodoStatus.PENDING,
                text: todo.text,
              },
            ]);
          });
      });
    });
  });

  describe('mutation', () => {
    describe('create (input) {}', () => {
      it('should returns an array of todos', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation {
            create (createTodo: {
              text: "any_text"
            }) { ${respFragment} }
          }`,
          })
          .expect(200)
          .expect((res) => {
            expect(getData(res).create).toMatchObject({
              id: expect.any(String),
              status: TodoStatus.PENDING,
              text: 'any_text',
            });
          });
      });

      it('should returns an array of todos', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation {
            create (createTodo: {
              text: "a"
            }) { ${respFragment} }
          }`,
          })
          .expect(200)
          .expect((res) => {
            expect(getData(res)).toBe(null);
            expect(getStatusCode(res)).toBe(HttpStatus.BAD_REQUEST);
            expect(getErrorMsg(res)).toEqual(['text must be longer than or equal to 3 characters']);
          });
      });
    });
  });
});
