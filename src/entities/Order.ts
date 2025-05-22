// src/entities/Order.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

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
  @Property()
  shippingAddress: string;

  @Field(() => String)
  @Property()
  billingAddress: string;

  @Field(() => String)
  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => Number)
  @Property({ type: "decimal" })
  total: number;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  trackingNumber?: string;

  constructor(
    user: User,
    shippingAddress: string,
    billingAddress: string,
    total: number
  ) {
    this.user = user;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.total = total;
  }
}