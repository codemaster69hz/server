// src/entities/Wishlist.ts
import { Entity, PrimaryKey, ManyToOne, Property, Collection, OneToMany } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { WishlistItem } from "./WishlistItem";

@ObjectType()
@Entity()
export class Wishlist {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(()=> [WishlistItem])
  @OneToMany(()=> WishlistItem, item => item.wishlist, { eager: true})
  items = new Collection<WishlistItem>(this);

  @Field(() => Date)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}