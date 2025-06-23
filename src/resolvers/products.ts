import { Resolver, Query, Ctx, Arg, Mutation, Int, FieldResolver, Root } from "type-graphql";
import { MyContext } from "../types";
import { Product } from "../entities/Products";
import { ProductInput, UpdateProductFields } from "../inputs/ProductInput";
import { Category } from "../entities/Category";
import { Company } from "../entities/Company";
import { ProductVariation } from "../entities/ProductVar";
import slugify from "slugify";
import { Review } from "../entities/Reviews";
import { PaginatedProducts } from "../types/PaginatedProducts"; // you'll create this type
import { v4 as uuidv4 } from 'uuid';

@Resolver(()=> Product)
export class ProductResolver {

  @Query(() => Product, { nullable: true })
    async product(
      @Arg("id") id: string,
      @Ctx() { em }: MyContext
    ): Promise<Product | null> {
      return await em.findOne(
        Product, 
        { id }, 
        { populate: ['variations', 'category', 'reviews.user', 'company'] }
      );
    }

  @Query(() => [Product])
  async myProducts(@Ctx() { em, req }: MyContext): Promise<Product[]> {
    if (!req.session.companyId) {
      throw new Error("Not authenticated");
    }
    return await em.find(Product, { company: req.session.companyId }, {
      populate: ['reviews', 'variations']
    });
  }

  @Query(() => Product, { nullable: true })
  async sellerProduct(
    @Arg("id") id: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Product | null> {
    if (!req.session.companyId) {
      throw new Error("Not authenticated");
    }

    const product = await em.findOne(
      Product, 
      { id, company: req.session.companyId }, 
      { 
        populate: [
          'variations', 
          'category', 
          'reviews.user', 
          'company'
        ] 
      }
    );

    if (!product) {
      throw new Error("Product not found or not owned by your company");
    }

    return product;
  }

  @Query(() => [Product])
  async getSimilarProducts(
    @Arg("category") category: string,
    @Arg("productId") productId: string,
    @Ctx() { em }: MyContext
  ): Promise<Product[]> {
    const categoryEntity = await em.findOne(Category, { name: category });
    if (!categoryEntity) {
      throw new Error(`Category "${category}" not found.`);
    }
    return await em.find(Product, {
      category: categoryEntity.id,
      id: { $ne: productId },
    });
  }

  @Query(() => [Product])
  async allProducts(
    @Ctx() { em }: MyContext,
    @Arg("category", { nullable: true }) categoryId?: string,
    @Arg("minPrice", { nullable: true }) minPrice?: number,
    @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    @Arg("material", { nullable: true }) material?: string
  ): Promise<Product[]> {
    const filters: any = {};
    if (categoryId) filters.category = categoryId;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price["$gte"] = minPrice;
      if (maxPrice) filters.price["$lte"] = maxPrice;
    }
    if (material) filters.material = material;

    return await em.find(Product, filters, { populate: ["variations", "category"] });
  }

  @Query(() => [Product])
  async getMaterials(
    @Ctx() { em }: MyContext,
    @Arg("material", { nullable: true }) material?: string
  ): Promise<Product[]> {
    const findm: any = {};
    if (material) findm.material = material;
    return em.find(Product, findm, { populate: ["variations"] });
  }

  // @Mutation(()=> Product)
  // async updateProducts(
  //   @Arg("id") id :string,
  //   @Arg("input", () => UpdateProductFields) input: UpdateProductFields,
  //   @Ctx() { em,req }: MyContext 
  // ): Promise<Product> {
  //   if (!req.session.companyId) {
  //     throw new Error("Not authenticated");
  //   }

  //   const updateProduct = await em.findOne(Product, { id });
  //   if (!updateProduct) {
  //     throw new Error("Product not found");
  //   } 

  //   em.assign(updateProduct, input);
  //   await em.persistAndFlush(updateProduct);
  //   return updateProduct;
  // }

  @Mutation(() => Product)
      async updateProducts(
        @Arg("id") id: string,
        @Arg("input", () => UpdateProductFields) input: UpdateProductFields,
        @Ctx() { em, req }: MyContext
      ): Promise<Product> {
        if (!req.session.companyId) {
          throw new Error("Not authenticated");
        }

        const product = await em.findOne(Product, { id }, { populate: ['variations'] });
        if (!product) {
          throw new Error("Product not found");
        }

        // If name is updated, update the slug too
        if (input.name && input.name !== product.name) {
          const baseSlug = slugify(input.name, { lower: true, strict: true });
          const uuidSuffix = uuidv4().split("-")[0];
          product.slug = `${baseSlug}-${uuidSuffix}`;

          // Optionally update slugs for variations
          for (const variation of product.variations) {
            const variationSuffix = uuidv4().split("-")[0];
            variation.slug = slugify(
              `${product.slug}-${variation.size}-${variation.color}-${variationSuffix}`,
              { lower: true, strict: true }
            );
            variation.name = input.name; // update name reference in variation too
          }
        }

        em.assign(product, input);
        await em.persistAndFlush(product);

        return product;
      }


  @Query(() => [Product])
  async filteredProducts(
    @Arg("search", { nullable: true }) search: string,
    @Arg("category", { nullable: true }) categoryId: string,
    @Arg("material", { nullable: true }) material: string,
    @Arg("minPrice", { nullable: true }) minPrice: number,
    @Arg("maxPrice", { nullable: true }) maxPrice: number,
    @Ctx() { em }: MyContext
  ): Promise<Product[]> {
    const filters: any = {};

    if (search) filters.name = { $ilike: `%${search}%` }; // PostgreSQL case-insensitive search
    if (categoryId) filters.category = categoryId;
    if (material) filters.material = material;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) filters.price["$gte"] = minPrice;
      if (maxPrice !== undefined) filters.price["$lte"] = maxPrice;
    }

    return await em.find(Product, filters, { populate: ["category"] });
  }

  @Query(() => [Product])
  async topRatedProducts(
    @Arg("limit", () => Int, { defaultValue: 5 }) limit: number,
    @Ctx() { em }: MyContext
  ): Promise<Product[]> {
    return em.find(
      Product,
      {},
      {
        orderBy: { averageRating: "DESC" },
        limit,
        populate: ["reviews", "variations"]
      }
    );
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("input", () => ProductInput) input: ProductInput,
    @Ctx() { em, req }: MyContext
  ): Promise<Product> {
    if (!req.session.companyId) {
      throw new Error("Not authenticated");
    }

    const company = await em.findOne(Company, { id: req.session.companyId });
    if (!company) {
      throw new Error("Company not found");
    }

    const category = await em.findOne(Category, { id: input.category });
    if (!category) throw new Error("Category not found");

    const baseSlug = slugify(input.name, { lower: true, strict: true });
    const uuidSuffix = uuidv4().split("-")[0]; // Short 6–8 chars
    const finalSlug = `${baseSlug}-${uuidSuffix}`;


    const product = em.create(Product, {
      ...input,
      category,
      company,
      slug: finalSlug,
      averageRating: 0,
      reviewCount: 0,
      variations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush(product);

    // Now create variations with slugs based on product slug
    if (input.variations) {
      for (const variationInput of input.variations) {
        // Slug for variation: base product slug + size + color
        const variationSlug = slugify(
          `${product.slug}-${variationInput.size}-${variationInput.color}-${uuidv4().split("-")[0]}`,
          { lower: true, strict: true }
        );

        const variation = em.create(ProductVariation, {
          ...variationInput,
          product,
          createdAt: new Date(),
          updatedAt: new Date(),
          productId: product.id,
          slug: variationSlug,  // Use variation-specific slug
          name: product.name,   // Inherit product name
          description: product.description,  // Inherit product description
          material: product.material,  // Inherit product material
        });
        await em.persistAndFlush(variation);
      }
    }

    return product;
  }

  @FieldResolver(() => [Review])
  async reviews(@Root() product: Product, @Ctx() { em }: MyContext) {
    await em.populate(product, ["reviews"]);
    return product.reviews;
  }

  @Query(() => Product, { nullable: true })
  async productBySlug(
    @Arg("slug") slug: string,
    @Ctx() { em }: MyContext
  ): Promise<Product | null> {
    return await em.findOne(Product, { slug }, { populate: ["variations", "category", 'reviews.user','company.cname'] });
  }

  @Query(() => [Product])
  async productsByCategory(
    @Arg("name") name: string,
    @Ctx() { em }: MyContext
  ): Promise<Product[]> {
    const category = await em.findOne(Category, { name });

    if (!category) throw new Error("Category not found");

    return em.find(Product, { category: category.id }, { populate: ["variations", "category"] });
  }

  @Query(() => PaginatedProducts)
    async paginatedProducts(
      @Ctx() { em }: MyContext,
      @Arg("limit", () => Int) limit: number,
      @Arg("cursor", { nullable: true }) cursor?: string
    ): Promise<PaginatedProducts> {
      const realLimit = Math.min(50, limit);
      const fetchLimit = realLimit + 1;

      const filters: any = {};

      if (cursor) {
        filters.createdAt = { $lt: new Date(parseInt(cursor)) }; // fetch older products
      }

      const products = await em.find(Product, filters, {
        orderBy: { createdAt: "DESC" },
        limit: fetchLimit,
        populate: ["category", "variations", "reviews"]
      });

      const hasMore = products.length === fetchLimit;
      const trimmed = products.slice(0, realLimit);

      return {
        products: trimmed,
        hasMore,
        nextCursor: hasMore
          ? String(new Date(trimmed[trimmed.length - 1].createdAt).getTime())
          : null,
      };
    }


    @Query(() => PaginatedProducts)
      async paginatedMyProducts(
        @Ctx() { em, req }: MyContext,
        @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
        @Arg("limit", () => Int, { defaultValue: 10 }) limit: number
      ): Promise<PaginatedProducts> {
        if (!req.session.companyId) {
          throw new Error("Not authenticated");
        }

        const realLimit = Math.min(50, limit);
        
        const [products, total] = await Promise.all([
          em.find(Product, { company: req.session.companyId }, {
            offset,
            limit: realLimit,
            orderBy: { createdAt: "DESC" },
            populate: ["category", "variations", "reviews"],
          }),
          em.count(Product, { company: req.session.companyId })
        ]);
        
        return {
          products,
          total,
        };
      }

}
