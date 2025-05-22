// entities/SavedProduct.ts
import { Entity, Property, PrimaryKey, ManyToOne, Unique } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Product } from "./Products";

@ObjectType()
@Entity()
@Unique({ properties: ["user", "product"] }) // Prevent duplicates
export class SavedProduct {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Product)
  product!: Product;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}
