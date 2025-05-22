import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "./Products";

@ObjectType()
@Entity()
export class Category {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => String)
  @Property()
  name!: string;

  @Field()
  @Property({ unique: true })
  slug!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  parentCategoryId?: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, { nullable: true, fieldName: "parentCategoryId" })
  parentCategory?: Category;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories = new Collection<Category>(this);

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.category)
  products = new Collection<Product>(this);

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
