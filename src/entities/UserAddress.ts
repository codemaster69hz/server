import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserAddress {
    @Field(() => ID)
    @PrimaryKey({ type: "uuid" })
    id: string = crypto.randomUUID();

    @Field(() => User)
    @ManyToOne(() => User, {
        index: true
    })
    user!: User;

    @Field()
    @Property()
    streetAddress!: string;

    @Field()
    @Property()
    streetAddress2!: string;

    @Field()
    @Property()
    country!: string;

    @Field()
    @Property()
    state!: string;

    @Field()
    @Property()
    city!: string;

    @Field()
    @Property()
    zipcode!: string;

    @Field({ defaultValue: false })
    @Property({ default: false })
    isDefaultShipping: boolean = false;
  
    @Field({ defaultValue: false })
    @Property({ default: false })
    isDefaultBilling: boolean = false;
  
}
