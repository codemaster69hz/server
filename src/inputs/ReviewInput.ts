import { Field, InputType, Int } from "type-graphql";

@InputType()
  export class ReviewInputs {
    @Field(() => Int)
    productId!: number;
  
    @Field(() => String)
    comment!: string;
  
    @Field(() => Int)
    rating!: number; // 1-5 scale

    @Field(() => String, { nullable: true })
    sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'; // New field  
  }