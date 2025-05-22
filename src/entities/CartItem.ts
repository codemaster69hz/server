// src/entities/CartItem.ts
import { Entity, PrimaryKey, Property, ManyToOne, Unique } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Cart } from "./Cart";
import { Product } from "./Products";
import { ProductVariation } from "./ProductVar";

@Unique({ properties: ['cart', 'product', 'variation'] })
@ObjectType()
@Entity()
export class CartItem {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => Product)
  @ManyToOne(() => Product)
  product!: Product;

  @Field(() => ProductVariation, { nullable: true })
  @ManyToOne(() => ProductVariation, { nullable: true })
  variation?: ProductVariation;

  @Field(() => Number)
  @Property({ type: "integer" })
  quantity!: number;

  @Field(() => Number)
  @Property({ type: "decimal" })
  price!: number;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  size?: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart)
  cart!: Cart;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
