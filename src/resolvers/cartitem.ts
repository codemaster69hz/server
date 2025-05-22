// src/resolvers/CartResolver.ts
import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { MyContext } from "../types";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Products";
import { ProductVariation } from "../entities/ProductVar";
import { User } from "../entities/User";
// import { User } from "../entities/User";

@Resolver(() => Cart)
export class CartResolver {
  // @Authorized()
  @Query(() => Cart, { nullable: true })
    async getCart(@Ctx() { em, req }: MyContext): Promise<Cart | null> {
      if (!req.session.userId) {
        throw new Error("Not authenticated");
      }

  const cart = await em.findOne(Cart, 
    { user: req.session.userId }, 
    { populate: ['items', 'items.product', 'items.variation'] }
  );

  return cart;
}  

@Mutation(() => CartItem)
async addToCart(
  @Arg("productId") productId: string,
  @Arg("quantity", () => Number) quantity: number,
  @Arg("variationId", { nullable: true }) variationId: string,
  @Ctx() { em, req }: MyContext
): Promise<CartItem> {
  if (!req.session.userId) {
    throw new Error("Not authenticated");
  }

  const userId = req.session.userId;

  // Fetch or create cart
  let cart = await em.findOne(Cart, { user: userId });
  if (!cart) {
    const user = await em.findOneOrFail(User, { id: userId });
    cart = em.create(Cart, {
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
      total: 0
    });
    await em.persistAndFlush(cart);
  }

  const product = await em.findOneOrFail(Product, { id: productId });

  let variation: ProductVariation | null = null;
  let price = product.price;
  let size: string | undefined;

  if (variationId) {
    variation = await em.findOneOrFail(ProductVariation, { id: variationId });
    if (variation.product.id !== product.id) {
      throw new Error("Variation does not belong to the product");
    }
    price = variation.price;
    size = variation.size;
  }

  // Check for existing item
  const existingItem = await em.findOne(CartItem, {
    cart: cart.id,
    product: product.id,
    variation: variation ?? null
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    await em.persistAndFlush(existingItem);
    return existingItem;
  }

  const cartItem = em.create(CartItem, {
    product,
    variation: variation || undefined,
    quantity,
    price,
    size,
    cart,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  cart.items.add(cartItem);
  await em.persistAndFlush(cartItem);

  return cartItem;
}


  @Mutation(() => Boolean)
  async clearCart(
    @Ctx() { em, req }: MyContext
  ): Promise<boolean> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const cart = await em.findOne(Cart, { user: req.session.userId }, { populate: ['items'] });
    if (!cart) throw new Error("Cart not found");

    await em.removeAndFlush(cart.items.getItems());
    return true;
  }

  @Query(() => Boolean)
    async isCartReadyForCheckout(
      @Ctx() { em, req }: MyContext
    ): Promise<boolean> {
      if (!req.session.userId) {
        throw new Error("Not authenticated");
      }

      const cart = await em.findOne(Cart, 
        { user: req.session.userId }, 
        { populate: ['items'] }
      );

      if (!cart || cart.items.length === 0) {
        return false;
      }
      return true;
    }
}