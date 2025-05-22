import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Admin {
  @Field()
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field()
  @Property({type: "text",unique: true})
  username!: string;

  @Field()
  @Property({type: "text",unique: true})
  email!: string;

  @Property({type: "text"})
  password!: string;

  @Field()
  @Property({ default: false })
  isEmailVerified!: boolean;

}