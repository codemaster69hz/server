import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "../entities/Products";

@ObjectType()
@Entity()
export class ProductVariation {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field()
  @Property()
  size!: string;

  @Field()
  @Property()
  color!: string;

  @Field()
  @Property({ type: "decimal" })
  price!: number;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product!: Product;

  @Field(()=> ID)
  productId!: string;

  @Field()
  @Property({ unique: true })
  slug!: string;

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property()
  description!: string;

  @Field()
  @Property()
  material!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  weight?: string;

  @Field(()=> String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(()=> String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
