import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ITodo, TodoStatus } from '@/domain/entities';
import { UserSchema } from '@/infra/entities';

@Entity('todo')
@ObjectType('Todo')
export class TodoSchema implements ITodo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  text: string;

  @Column({ default: TodoStatus.PENDING })
  @Field()
  status: TodoStatus;

  @Column({ default: new Date().toISOString() })
  @Field()
  createdAt: string;

  @ManyToOne(() => UserSchema, (user) => user.todos)
  @Field(() => UserSchema)
  user: UserSchema;
}
