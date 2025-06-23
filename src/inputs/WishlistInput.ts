// src/inputs/CartInput.ts
import { InputType, Field } from "type-graphql";

@InputType()
export class WishlistInput {
  @Field()
  productId!: string;

  @Field({ nullable: true })
  variationId?: string;
}
