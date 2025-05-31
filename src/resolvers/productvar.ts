import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { ProductVariation } from "../entities/ProductVar";
import { Product } from "../entities/Products";
import { MyContext } from "../types";
import slugify from "slugify";
import { UpdateProductVariations } from "../inputs/ProductVarInput";

@Resolver()
export class ProductVariationResolver {
    @Query(() => [ProductVariation])
    async productVariations(@Ctx() { em }: MyContext): Promise<ProductVariation[]> {
        return await em.find(ProductVariation, {});
    }

    @Query(() => ProductVariation, { nullable: true })
    async productVariation(
        @Arg("id") id: string,
        @Ctx() { em }: MyContext
    ): Promise<ProductVariation | null> {
        return await em.findOne(ProductVariation, { id });
    }

    @Query(() => [String])
        async getUniqueSizes(
            @Ctx() { em }: MyContext
        ): Promise<string[]> {
            const knex = em.getConnection().getKnex();  // Get Knex instance from MikroORM
            const result = await knex("product_variation").distinct("size");

            return result.map((row: { size: string }) => row.size);  // Extract only sizes
        }


    @Mutation(() => ProductVariation)
    async createProductVariation(
        @Arg("size") size: string,
        @Arg("color") color: string,
        @Arg("price") price: number,
        @Arg("productId") productId: string,
        @Ctx() { em }: MyContext
    ): Promise<ProductVariation> {
        const product = await em.findOne(Product, { id: productId });
        if (!product) {
            throw new Error("Product not found");
        }
        const slug = slugify(`${product.slug}-${size}-${color}`, { lower: true, strict: true });

        const productVariation = em.create(ProductVariation, {
            size,
            color,
            price,
            product,
            createdAt: new Date(),
            updatedAt: new Date(),
            productId: product.id,
            name: product.name,
            description: product.description,
            material: product.material,
            weight: product.weight,
            slug
        });

        await em.persistAndFlush(productVariation);
        return productVariation;
    }

    @Mutation(()=> ProductVariation)
    async updateProductVar(
        @Arg("id") id: string,
        @Arg("input", () => UpdateProductVariations) input: UpdateProductVariations,
        @Ctx() { em,req }: MyContext
    ): Promise<ProductVariation> {
        if (!req.session.companyId) {
            throw new Error("Not authenticated");
        }

        const provar = await em.findOne(ProductVariation, { id });
        if(!provar){
            throw new Error("Variation doesn't exists");
        }

        em.assign(provar, input);
        await em.flush();

        return provar;
    }

    @Query(() => ProductVariation, { nullable: true })
        async productBySlugVariations(
            @Arg("slug") slug: string,
            @Ctx() { em }: MyContext
        ): Promise<ProductVariation | null> {
            return await em.findOne(ProductVariation, { slug });
        }
}
