import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from '@/domain/entities';
import { TodoSchema } from '@/infra/entities';

@Entity('user')
@ObjectType('User')
export class UserSchema implements IUser {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;

  @OneToMany(() => TodoSchema, (todo) => todo.user)
  @Field(() => [TodoSchema])
  todos?: TodoSchema[];
}
