// src/inputs/CartInput.ts
import { InputType, Field } from "type-graphql";

@InputType()
export class AddToCartInput {
  @Field()
  productId!: string;

  @Field({ defaultValue: 1 })
  quantity!: number;

  @Field({ nullable: true })
  variationId?: string;
}

@InputType()
export class UpdateCartItemInput {
  @Field()
  itemId!: string;

  @Field()
  quantity!: number;
}