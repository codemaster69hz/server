import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Product } from './Products';

@ObjectType()
@Entity()
export class Company {
  @Field()
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field()
  @Property({type: "text",unique: true})
  username!: string;

  @Field()
  @Property({type: "text",unique: true})
  cname!: string;

  @Field()
  @Property({type: "bigint",unique: true})
  contact!: number;

  @Field()
  @Property({type: "text",unique: true})
  email!: string;

  @Field()
  @Property({type: "text"})
  password!: string;

  @Field()
  @Property({type: "text"})
  location!: string;

  @Field()
  @Property({ default: false })
  isEmailVerified!: boolean;

  @Field(()=> String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(()=> String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.company)
  products = new Array<Product>();
}