import { Field, InputType } from "type-graphql";
// import { Length } from "class-validator"; // Optional validation

@InputType()
export class UserAddressInput {
    @Field()
    // @Length(1, 255)
    streetAddress!: string;

    @Field()
    // @Length(0, 255)
    streetAddress2!: string;

    @Field()
    country!: string;

    @Field()
    state!: string;

    @Field()
    city!: string;

    @Field()
    zipcode!: string;
}

@InputType()
export class UpdateUserAddressInput {
    @Field({ nullable: true })
    streetAddress?: string;
  
    @Field({ nullable: true })
    streetAddress2?: string;
  
    @Field({ nullable: true })
    city?: string;
  
    @Field({ nullable: true })
    state?: string;
  
    @Field({ nullable: true })
    country?: string;
  
    @Field({ nullable: true })
    zipcode?: string;
  }