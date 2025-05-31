import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { MyContext } from "../types";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { User } from "../entities/User";
import { UserAddress } from "../entities/UserAddress";

@Resolver(() => Order)
export class OrderResolver {
  @Query(() => [Order])
  async getOrders(
    @Ctx() { em, req }: MyContext
  ): Promise<Order[]> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    return await em.find(
      Order,
      { user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation', 'shippingAddress', 'billingAddress'] }
    );
  }

  @Query(() => Order, { nullable: true })
  async getOrder(
    @Arg("id") id: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Order | null> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    return await em.findOne(
      Order,
      { id, user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation', 'shippingAddress', 'billingAddress'] }
    );
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg("shippingAddressId") shippingAddressId: string,
    @Arg("billingAddressId") billingAddressId: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Order> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const [cart, user, shippingAddress, billingAddress] = await Promise.all([
      em.findOne(Cart, { user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation'] }),
      em.findOneOrFail(User, { id: req.session.userId }),
      em.findOneOrFail(UserAddress, { id: shippingAddressId }),
      em.findOneOrFail(UserAddress, { id: billingAddressId }),
    ]);

    if (!cart) throw new Error("Cart not found");
    if (cart.items.length === 0) throw new Error("Cannot create order from empty cart");

    const order = em.create(Order, {
      user,
      status: OrderStatus.PROCESSING,
      shippingAddress,
      billingAddress,
      total: cart.total,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    for (const cartItem of cart.items.getItems()) {
      const orderItem = em.create(OrderItem, {
        product: cartItem.product,
        variation: cartItem.variation || undefined,
        quantity: cartItem.quantity,
        price: cartItem.price,
        size: cartItem.size,
        order,
        createdAt: new Date()
      });

      order.items.add(orderItem);
    }

    await em.removeAndFlush(cart.items.getItems());
    await em.removeAndFlush(cart);
    await em.persistAndFlush(order);

    return order;
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg("orderId") orderId: string,
    @Arg("status") status: OrderStatus,
    @Ctx() { em, req }: MyContext
  ): Promise<Order> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const order = await em.findOneOrFail(Order, {
      id: orderId,
      user: req.session.userId
    });

    order.status = status;
    await em.persistAndFlush(order);

    return order;
  }
}
