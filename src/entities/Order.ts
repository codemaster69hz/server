// src/entities/Order.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { registerEnumType } from "type-graphql";
// import { UserAddress } from "./UserAddress";

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

registerEnumType(OrderStatus, {
  name: "OrderStatus", // this name will be used in the GraphQL schema
  description: "The status of the order" // optional
});

@ObjectType()
@Entity()
export class Order {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, item => item.order, { eager: true })
  items = new Collection<OrderItem>(this);

  @Field(() => OrderStatus)
  @Enum(() => OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String, { nullable: true })
  @Property({ onCreate: ()=> new Date()})
  estimatedDeliveryDate: Date = new Date();

  @Field(() => Number)
  @Property({ type: "decimal" })
  total!: number;

}