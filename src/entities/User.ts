import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import crypto from 'crypto';
import { UserAddress } from './UserAddress';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  @Field()
  @Property({ type: "text", unique: true })
  contact!: number;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  @Field()
  @Property({ default: false })
  isEmailVerified!: boolean;

  @Property({ type: "boolean", default: false })
  isPhoneVerified: boolean = false;
   
  @Field(()=> [UserAddress])
  @OneToMany(() => UserAddress, (address) => address.user)
  addresses = new Collection<UserAddress>(this);

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  ip?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  region?: string;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

}