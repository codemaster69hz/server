import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { Wishlist } from "../entities/Wishlist";
import { Product } from "../entities/Products";
import { MyContext } from "../types";
import { User } from "../entities/User";
import { WishlistItem } from "../entities/WishlistItem";
import { ProductVariation } from "../entities/ProductVar";

@Resolver()
export class WishlistResolver {
  
  @Query(() => Wishlist, { nullable: true })
  async getWishlist(@Ctx() { em, req }: MyContext): Promise<Wishlist | null> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const wishlist = await em.findOne(
      Wishlist,
      { user: req.session.userId },
      { populate: ['items', 'items.product', 'items.variation'] }
    );

    return wishlist;
  }

  @Mutation(() => WishlistItem)
  async addtoWishlist(
    @Arg("productId", ()=> String) productId: string,
    @Arg("variationId", ()=> String, { nullable: true }) variationId: string,
    @Ctx() { em, req }: MyContext
  ): Promise<WishlistItem> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const userId = req.session.userId;

    let wishlist = await em.findOne(Wishlist, { user: userId });
    if (!wishlist) {
      const user = await em.findOneOrFail(User, { id: userId });
      wishlist = em.create(Wishlist, {
        user,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await em.persistAndFlush(wishlist);
    }

    const product = await em.findOneOrFail(Product, { id: productId });

    let variation: ProductVariation | null = null;
    let price = product.price;

    if (variationId) {
      variation = await em.findOneOrFail(ProductVariation, { id: variationId });
      if (variation.product.id !== product.id) {
        throw new Error("Variation doesn't exist");
      }
      price = variation.price;
    }

    const wishlistItem = em.create(WishlistItem, {
      product,
      variation: variation || undefined,
      price,
      wishlist,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    wishlist.items.add(wishlistItem);
    wishlist.updatedAt = new Date();

    await em.persistAndFlush(wishlistItem);
    return wishlistItem;
  }

  @Mutation(() => Boolean)
  async clearWishlist(
    @Ctx() { em, req }: MyContext
  ): Promise<boolean> {
    if (!req.session.userId) {
      throw new Error("Not authenticated");
    }

    const wishlist = await em.findOne(
      Wishlist,
      { user: req.session.userId },
      { populate: ['items'] }
    );

    if (!wishlist) {
      throw new Error("Wishlist not found");
    }

    await em.removeAndFlush(wishlist.items.getItems());
    wishlist.updatedAt = new Date();
    await em.persistAndFlush(wishlist);

    return true;
  }
}
