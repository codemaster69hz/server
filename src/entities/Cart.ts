// src/entities/Cart.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { CartItem } from "./CartItem";

@ObjectType()
@Entity()
export class Cart {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, item => item.cart, { eager: true }) // <--- add `eager: true`
  items = new Collection<CartItem>(this);

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => Number)
  get total(): number {
    return this.items.getItems().reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
}