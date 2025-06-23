// src/entities/CartItem.ts
import { Entity, PrimaryKey, Property, ManyToOne, Unique } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Wishlist } from "./Wishlist";
import { Product } from "./Products";
import { ProductVariation } from "./ProductVar";

@Unique({ properties: ['product', 'variation', 'wishlist'] })
@ObjectType()
@Entity()
export class WishlistItem {
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
  @Property({ type: "decimal" })
  price!: number;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  size?: string;

  @Field(() => Wishlist)
  @ManyToOne(() => Wishlist)
  wishlist!: Wishlist;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
