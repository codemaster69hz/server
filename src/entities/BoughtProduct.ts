import { Entity, PrimaryKey, ManyToOne, Property } from "@mikro-orm/core";
import { Product } from "./Products";
import { User } from "./User";
import { Field, ID } from "type-graphql";

@Entity()
export class BoughtProduct {
  @Field(()=> ID)  
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(()=> User)
  @ManyToOne(() => User)
  user!: User;

  @Field(()=> Product)
  @ManyToOne(() => Product)
  product!: Product;

  @Field(()=> String)
  @Property({ onCreate: () => new Date() })
  boughtAt: Date = new Date();
}
