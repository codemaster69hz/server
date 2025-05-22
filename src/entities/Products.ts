import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, BeforeCreate } from "@mikro-orm/core";
import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { ProductVariation } from "../entities/ProductVar";
import { Company } from "./Company";
import slugify from "slugify";
import { Review } from "./Reviews";

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field()
  @Property()
  name!: string;

  @Field()
  @Property({ unique: true})
  slug!: string;

  @Field()
  @Property({type: "text"})
  description!: string;

  @Field()
  @Property({ type: "decimal" })
  price!: number;

  @Field()
  @Property()
  size!: string;

  @Field()
  @Property()
  material!: string;

  @Field()
  @Property({type: "text"})
  weight!: string;

  @Field(() => Category)
  @ManyToOne(() => Category)
  category!: Category;

  @Field(() => Category)
  @ManyToOne(() => Category)
  subcategory!: string;

  @Field(() => [ProductVariation])
  @OneToMany(() => ProductVariation, (variation) => variation.product)
  variations = new Collection<ProductVariation>(this);

  @Field(()=> Company)
  @ManyToOne(() => Company)
  company!: Company;

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.product)
  reviews = new Collection<Review>(this);

  @Field(() => Float, { nullable: true })
  @Property({ nullable: true })
  averageRating?: number;

  @Field(() => Int, { nullable: true })
  @Property({ nullable: true })
  reviewCount?: number;

  @BeforeCreate()
  generateSlug() {
    if (!this.slug) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    }
  }
  
  @Field(()=> String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(()=> String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

