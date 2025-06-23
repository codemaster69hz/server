import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { MyContext } from "../types";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { User } from "../entities/User";
import { Company } from "../entities/Company";
import { getEstimatedDeliveryDate } from "../utils/shipping";
// import slugify from "slugify";

@Resolver(() => Order)
export class OrderResolver {
  @Query(() => [Order])
  async getOrders(@Ctx() { em, req }: MyContext): Promise<Order[]> {
    if (!req.session.userId) throw new Error("Not authenticated");

    return await em.find(
      Order,
      { user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation', 'user.id'] }
    );
  }

  @Query(() => Order, { nullable: true })
      async getOrder(
        @Arg("id") id: string,
        @Ctx() { em, req }: MyContext
      ): Promise<Order | null> {
        if (!req.session.userId) {
          throw new Error("Not authenticated - Please log in to view this order");
        }

        const order = await em.findOne(
          Order,
          { id },
          { 
            populate: [
              'items', 
              'items.product', 
              'items.variation', 
              'user',
              'user.addresses'
            ]
          }
        );

        if (!order) {
          throw new Error("Order not found");
        }

        if (order.user.id !== req.session.userId) {
          throw new Error("Unauthorized - You don't have permission to view this order");
        }

        return order;
      }

  @Mutation(() => Order)
      async createOrder(
        @Ctx() { em, req }: MyContext
      ): Promise<Order> {
        if (!req.session.userId) {
          throw new Error("Not authenticated");
        }

        const user = await em.findOne(User, { id: req.session.userId });
          if (!user) {
            throw new Error("User not found");
          }

        const existingOrder = await em.findOne(Order, { id: req.session.orderId });
          if (existingOrder) {
            throw new Error("Order already exists");
          }

        const cart = await em.findOne(
          Cart,
          { user: req.session.userId },
          { populate: ['items', 'items.product', 'items.variation'] }
        );

        if (!cart || cart.items.length === 0) {
          throw new Error("Cart is empty or not found");
        }

        const total = cart.items.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0);

        // const baseSlug = slugify(order.id, { lower: true, strict: true });
        // const uuidSuffix = uuidv4().split("-")[0]; // Short 6–8 chars
        // const finalSlug = `${baseSlug}-${uuidSuffix}`;

        return await em.transactional(async (em) => {
          const order = em.create(Order, {
            user,
            status: OrderStatus.PROCESSING,
            total,
            // finalSlug,
            estimatedDeliveryDate: getEstimatedDeliveryDate(),
            createdAt: new Date(),
            updatedAt: new Date()
          });

          for (const cartItem of cart.items) {
            const orderItem = em.create(OrderItem, {
              product: cartItem.product,
              variation: cartItem.variation || undefined,
              quantity: cartItem.quantity,
              price: cartItem.price,
              size: cartItem.size,
              order,
              user,
              createdAt: new Date()
            });
            order.items.add(orderItem);
          }

          await em.persistAndFlush(order);

          await em.removeAndFlush(cart.items.getItems());
          em.remove(cart);
          await em.flush();

          return await em.findOneOrFail(
            Order,
            { id: order.id },
            {
              populate: ['items', 'items.product', 'items.variation', 'user.username'],
            }
          );
        });
      }


  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg("orderId") orderId: string,
    @Arg("status") status: OrderStatus,
    @Ctx() { em, req }: MyContext
  ): Promise<Order> {
    if (!req.session.userId) throw new Error("Not authenticated");

    const order = await em.findOneOrFail(Order, {
      id: orderId,
      user: req.session.userId
    });

    order.status = status;
    await em.persistAndFlush(order);

    return order;
  }

  @Query(() => [Order])
  async getSellerOrders(@Ctx() { em, req }: MyContext): Promise<Order[]> {
    const company = await em.findOneOrFail(Company, { id: req.session.companyId });

    const orderItems = await em.find(OrderItem, {
      product: { company },
    }, {
      populate: ['product', 'order', 'variation', 'user', 'order.user.addresses', 'order.createdAt'],
    });

    const ordersMap = new Map<string, Order>();

    for (const item of orderItems) {
      ordersMap.set(item.order.id, item.order);
    }

    return Array.from(ordersMap.values());
  }
}

