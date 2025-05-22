// src/entities/OrderItem.ts
import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Order } from "./Order";
import { Product } from "./Products";
import { ProductVariation } from "./ProductVar";

@ObjectType()
@Entity()
export class OrderItem {
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

  @Field(() => Order)
  @ManyToOne(() => Order)
  order!: Order;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}