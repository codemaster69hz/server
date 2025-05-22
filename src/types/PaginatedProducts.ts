import { ObjectType, Field, Int } from "type-graphql";
import { Product } from "../entities/Products";

@ObjectType()
export class PaginatedProducts {
  @Field(() => [Product])
  products!: Product[];

  @Field(()=> Boolean, {nullable: true})
  hasMore?: boolean;

  @Field(()=> String, {nullable: true})
  nextCursor?: string | null;

  @Field(()=> Int)
  total?: number;
}
