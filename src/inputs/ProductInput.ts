import { InputType, Field, Float } from "type-graphql";
import { ProductVariationInput } from "../inputs/ProductVarInput";

@InputType()
export class ProductInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  subcategory!: string; 

  @Field()
  material!: string;

  @Field()
  size!: string

  @Field(() => String)
  category!: string;

  @Field(() => [ProductVariationInput], { nullable: true }) 
  variations?: ProductVariationInput[]; 

  @Field(() => String) 
  weight!: string;
}

@InputType()
export class UpdateProductFields {
  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  description?: string;

  @Field(() => Float, {nullable: true})
  price?: number;

  @Field({nullable: true})
  size?: string;

  @Field({nullable: true})
  weight?: string;

  @Field({nullable: true})
  material?: string;
}

 