// src/resolvers/BoughtProductResolver.ts
import { Resolver, Ctx, Query, Arg } from "type-graphql";
import { MyContext } from "../types";
import { BoughtProduct } from "../entities/BoughtProduct";
import { Product } from "../entities/Products";

@Resolver()
export class BoughtProductResolver {
  
  @Query(() => Boolean)
  async hasUserBoughtProduct(
    @Arg("productId") productId: string,
    @Ctx() { em, req }: MyContext
  ): Promise<boolean> {
    const userId = req.session.userId;
    if (!userId) throw new Error("Not authenticated");

    const bought = await em.findOne(BoughtProduct, {
      user: userId,
      product: productId,
    });

    return !!bought;
  }

  @Query(() => [Product])
  async getBoughtProducts(
    @Ctx() { em, req }: MyContext
  ): Promise<Product[]> {
    const userId = req.session.userId;
    if (!userId) throw new Error("Not authenticated");

    const records = await em.find(BoughtProduct, {
      user: userId
    }, { populate: ['product'] });

    return records.map(r => r.product);
  }
}
