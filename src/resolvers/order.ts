// src/resolvers/OrderResolver.ts
import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";
import { MyContext } from "../types";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
// import { CartItem } from "../entities/CartItem";
import { User } from "../entities/User";

@Resolver(() => Order)
export class OrderResolver {
  @Authorized()
  @Query(() => [Order])
  async getOrders(
    @Ctx() { em, req }: MyContext
  ): Promise<Order[]> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const orders = await em.find(Order, 
      { user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation'] }
    );

    return orders;
  }

  @Authorized()
  @Query(() => Order, { nullable: true })
  async getOrder(
    @Arg("id") id: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Order | null> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const order = await em.findOne(Order, 
      { id, user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation'] }
    );

    return order;
  }

  @Authorized()
  @Mutation(() => Order)
  async createOrder(
    @Arg("shippingAddress") shippingAddress: string,
    @Arg("billingAddress") billingAddress: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Order> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    // Get user's cart with items
    const cart = await em.findOne(Cart, 
      { user: req.session.userId }, 
      { populate: ['items', 'items.product', 'items.variation'] }
    );

    if (!cart) {
      throw new Error("Cart not found");
    }

    if (cart.items.length === 0) {
      throw new Error("Cannot create order from empty cart");
    }

    const user = await em.findOneOrFail(User, { id: req.session.userId });

    // Create the order
    const order = new Order(
      user,
      shippingAddress,
      billingAddress,
      cart.total
    );

    // Convert cart items to order items
    for (const cartItem of cart.items.getItems()) {
      const orderItem = new OrderItem();
      orderItem.product = cartItem.product;
      orderItem.variation = cartItem.variation || undefined;
      orderItem.quantity = cartItem.quantity;
      orderItem.price = cartItem.price;
      orderItem.size = cartItem.size;
      orderItem.order = order;
      
      order.items.add(orderItem);
      await em.persist(orderItem);
    }

    // Clear the cart
    await em.removeAndFlush(cart.items.getItems());
    await em.removeAndFlush(cart);

    await em.persistAndFlush(order);

    return order;
  }

  @Authorized()
  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg("orderId") orderId: string,
    @Arg("status") status: OrderStatus,
    @Ctx() { em, req }: MyContext
  ): Promise<Order> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const order = await em.findOne(Order, { id: orderId, user: req.session.userId });
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    await em.persistAndFlush(order);

    return order;
  }

  @Authorized(['ADMIN']) // Assuming you have role-based auth
  @Mutation(() => Order)
  async adminUpdateOrderStatus(
    @Arg("orderId") orderId: string,
    @Arg("status") status: OrderStatus,
    @Arg("trackingNumber", { nullable: true }) trackingNumber: string,
    @Ctx() { em }: MyContext
  ): Promise<Order> {
    const order = await em.findOneOrFail(Order, { id: orderId });
    order.status = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await em.persistAndFlush(order);

    return order;
  }
}