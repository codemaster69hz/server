// import { Resolver, Mutation, Query, Arg, Ctx, InputType, Field, Int, ObjectType } from "type-graphql";
// import { Review, ReviewSentiment } from "../entities/Reviews";
// import { Product } from "../entities/Products";
// import { User } from "../entities/User";
// import { MyContext } from "../types";
// import { registerEnumType } from "type-graphql";

// registerEnumType(ReviewSentiment, {
//   name: "ReviewSentiment", // this name will be used in GraphQL schema
//   description: "Sentiment of the review",
// });

// @InputType()
// class ReviewInput {
//   @Field(() => String) // Changed from Int to String since IDs are often strings
//   productId!: string;

//   @Field(() => String)
//   comment!: string;

//   @Field(() => Int)
//   rating!: number; // 1-5

//   @Field(() => ReviewSentiment, { nullable: true })
//   sentiment?: ReviewSentiment // New field  
// }

// @ObjectType()
// class PaginatedReviews {
//   @Field(() => [Review])
//   items!: Review[];

//   @Field(() => Int)
//   total!: number;

//   @Field(() => Boolean)
//   hasMore!: boolean;
// }

// const MIN_RATING = 1;
// const MAX_RATING = 5;

// @Resolver(() => Review)
// export class ReviewResolver {
//   // --------------------------
//   // MUTATIONS
//   // --------------------------

//   private determineSentiment(rating: number): ReviewSentiment {
//     if (rating >= 4) return ReviewSentiment.POSITIVE;
//     if (rating === 3) return ReviewSentiment.NEUTRAL;
//     return ReviewSentiment.NEGATIVE;
//   }

//   @Mutation(() => Review)
//   async createReview(
//     @Arg("input") input: ReviewInput,
//     @Ctx() { em, req }: MyContext
//   ): Promise<Review> {
//     if (!req.session.userId) throw new Error("Not authenticated");

//     // Validate rating
//     if (!Number.isInteger(input.rating) || input.rating < MIN_RATING || input.rating > MAX_RATING) {
//       throw new Error(`Rating must be an integer between ${MIN_RATING}-${MAX_RATING}`);
//     }

//     const [user, product] = await Promise.all([
//       em.findOne(User, { id: req.session.userId }),
//       em.findOne(Product, { id: input.productId })
//     ]);

//     if (!user || !product) throw new Error("User or product not found");

//     // Check for existing review
//     const existingReview = await em.findOne(Review, {
//       user: user.id,
//       product: product.id
//     });
//     if (existingReview) throw new Error("You already reviewed this product");

//     // Initialize product review stats if undefined
//     if (product.averageRating === undefined) {
//       product.averageRating = 0;
//     }
//     if (product.reviewCount === undefined) {
//       product.reviewCount = 0;
//     }

//     let sentiment = input.sentiment;
//       if (!sentiment) {
//         sentiment = this.determineSentiment(input.rating);
//       }


//     // Create review
//     const review = em.create(Review, {
//       user,
//       product,
//       sentiment,
//       comment: input.comment,
//       rating: input.rating,
//       createdAt: new Date(),
//     });

//     // Update product stats (optimized)
//     product.reviewCount += 1;
//     product.averageRating = parseFloat(
//       ((product.averageRating * (product.reviewCount - 1) + input.rating) / 
//       product.reviewCount).toFixed(2) // 2 decimal places for more precision
//     );

//     await em.persistAndFlush([review, product]);
//     return review;
//   }

//   // --------------------------
//   // QUERIES
//   // --------------------------
  

//   // @Query(() => [Review])
//   //   async productReviews(
//   //   @Arg("productId") productId: string,
//   //   @Ctx() { em }: MyContext
//   //   ): Promise<Review[]> {
//   //   return em.find(
//   //       Review,
//   //       { 
//   //       product: productId,
//   //       },
//   //       { 
//   //       orderBy: { createdAt: 'DESC' },
//   //       populate: ['user'],
//   //       // actualLimit: 10 // Some older versions use this
//   //       }
//   //   );
//   //   }

//   // SAME QUERY BUT ONLY PAGINATION LOGIC IS IMPLEMENTED BELOW

//   @Query(() => PaginatedReviews)
//       async productReviews(
//         @Arg("slug") slug: string,
//         @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
//         @Arg("offset", () => Int, { defaultValue: 0 }) offset: number,
//         @Ctx() { em }: MyContext
//       ): Promise<PaginatedReviews> {
//         // First find the product by slug
//         const product = await em.findOne(Product, { slug });
        
//         if (!product) {
//           throw new Error("Product not found");
//         }

//         // Then find reviews for this product's ID
//         const [reviews, total] = await em.findAndCount(
//           Review,
//           { product: product.id }, // Use the actual UUID here
//           {
//             orderBy: { createdAt: 'DESC' },
//             populate: ['user'],
//             limit,
//             offset
//           }
//         );

//   return {
//     items: reviews,
//     total,
//     hasMore: offset + limit < total
//   };
// }

//   @Query(() => [Review])
//   async userReviews(
//     @Ctx() { em, req }: MyContext
//   ): Promise<Review[]> {
//     if (!req.session.userId) throw new Error("Not authenticated");
//     return em.find(Review, { user: req.session.userId }, {
//       populate: ['product','product.reviews']
//     });
//   }

//   @Mutation(() => Boolean)
//     async deleteReview(
//     @Arg("reviewId") reviewId: string,
//     @Ctx() { em, req }: MyContext
//     ): Promise<boolean> {
//     if (!req.session.userId) {
//         throw new Error("Not authenticated");
//     }

//     // Find the review with the product and user populated
//     const review = await em.findOne(
//         Review,
//         { id: reviewId },
//         { populate: ['product', 'user'] }
//     );

//     if (!review) {
//         throw new Error("Review not found");
//     }

//     // Check if the current user is the owner of the review
//     if (review.user.id !== req.session.userId) {
//         throw new Error("You can only delete your own reviews");
//     }

//     const product = review.product;

//     // Initialize reviewCount if undefined
//     if (product.reviewCount === undefined) {
//         product.reviewCount = 0;
//     }

//     // Initialize averageRating if undefined
//     if (product.averageRating === undefined) {
//         product.averageRating = 0;
//     }

//     // Start a transaction to ensure data consistency
//     await em.begin();
//     try {
//         // Delete the review
//         await em.removeAndFlush(review);

//         // Update product stats only if reviewCount > 0 to avoid division by zero
//         if (product.reviewCount > 0) {
//         product.reviewCount -= 1;
        
//         // If this was the last review, reset average rating
//         if (product.reviewCount === 0) {
//             product.averageRating = 0;
//         } else {
//             // Recalculate average rating
//             product.averageRating = parseFloat(
//             ((product.averageRating * (product.reviewCount + 1) - review.rating) / 
//             product.reviewCount
//             ).toFixed(2)
//         )}
//          } else {
//         // If reviewCount was already 0, just set it to 0 (though this shouldn't happen)
//          product.reviewCount = 0;
//          product.averageRating = 0;
//         }
        
//         await em.persistAndFlush(product);
//         await em.commit();
//         return true;
//     } catch (error) {
//         await em.rollback();
//         throw error;
//     }
//     }
// }