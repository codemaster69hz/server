"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Reviews_1 = require("../entities/Reviews");
const Products_1 = require("../entities/Products");
const User_1 = require("../entities/User");
const type_graphql_2 = require("type-graphql");
(0, type_graphql_2.registerEnumType)(Reviews_1.ReviewSentiment, {
    name: "ReviewSentiment",
    description: "Sentiment of the review",
});
let ReviewInput = class ReviewInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReviewInput.prototype, "productId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReviewInput.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ReviewInput.prototype, "rating", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Reviews_1.ReviewSentiment, { nullable: true }),
    __metadata("design:type", String)
], ReviewInput.prototype, "sentiment", void 0);
ReviewInput = __decorate([
    (0, type_graphql_1.InputType)()
], ReviewInput);
let PaginatedReviews = class PaginatedReviews {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Reviews_1.Review]),
    __metadata("design:type", Array)
], PaginatedReviews.prototype, "items", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedReviews.prototype, "total", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], PaginatedReviews.prototype, "hasMore", void 0);
PaginatedReviews = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedReviews);
const MIN_RATING = 1;
const MAX_RATING = 5;
let ReviewResolver = class ReviewResolver {
    determineSentiment(rating) {
        if (rating >= 4)
            return Reviews_1.ReviewSentiment.POSITIVE;
        if (rating === 3)
            return Reviews_1.ReviewSentiment.NEUTRAL;
        return Reviews_1.ReviewSentiment.NEGATIVE;
    }
    async createReview(input, { em, req }) {
        if (!req.session.userId)
            throw new Error("Not authenticated");
        if (!Number.isInteger(input.rating) || input.rating < MIN_RATING || input.rating > MAX_RATING) {
            throw new Error(`Rating must be an integer between ${MIN_RATING}-${MAX_RATING}`);
        }
        const [user, product] = await Promise.all([
            em.findOne(User_1.User, { id: req.session.userId }),
            em.findOne(Products_1.Product, { id: input.productId })
        ]);
        if (!user || !product)
            throw new Error("User or product not found");
        const existingReview = await em.findOne(Reviews_1.Review, {
            user: user.id,
            product: product.id
        });
        if (existingReview)
            throw new Error("You already reviewed this product");
        if (product.averageRating === undefined) {
            product.averageRating = 0;
        }
        if (product.reviewCount === undefined) {
            product.reviewCount = 0;
        }
        let sentiment = input.sentiment;
        if (!sentiment) {
            sentiment = this.determineSentiment(input.rating);
        }
        const review = em.create(Reviews_1.Review, {
            user,
            product,
            sentiment,
            comment: input.comment,
            rating: input.rating,
            createdAt: new Date(),
        });
        product.reviewCount += 1;
        product.averageRating = parseFloat(((product.averageRating * (product.reviewCount - 1) + input.rating) /
            product.reviewCount).toFixed(2));
        await em.persistAndFlush([review, product]);
        return review;
    }
    async productReviews(slug, limit, offset, { em }) {
        const product = await em.findOne(Products_1.Product, { slug });
        if (!product) {
            throw new Error("Product not found");
        }
        const [reviews, total] = await em.findAndCount(Reviews_1.Review, { product: product.id }, {
            orderBy: { createdAt: 'DESC' },
            populate: ['user'],
            limit,
            offset
        });
        return {
            items: reviews,
            total,
            hasMore: offset + limit < total
        };
    }
    async userReviews({ em, req }) {
        if (!req.session.userId)
            throw new Error("Not authenticated");
        return em.find(Reviews_1.Review, { user: req.session.userId }, {
            populate: ['product', 'product.reviews']
        });
    }
    async deleteReview(reviewId, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const review = await em.findOne(Reviews_1.Review, { id: reviewId }, { populate: ['product', 'user'] });
        if (!review) {
            throw new Error("Review not found");
        }
        if (review.user.id !== req.session.userId) {
            throw new Error("You can only delete your own reviews");
        }
        const product = review.product;
        if (product.reviewCount === undefined) {
            product.reviewCount = 0;
        }
        if (product.averageRating === undefined) {
            product.averageRating = 0;
        }
        await em.begin();
        try {
            await em.removeAndFlush(review);
            if (product.reviewCount > 0) {
                product.reviewCount -= 1;
                if (product.reviewCount === 0) {
                    product.averageRating = 0;
                }
                else {
                    product.averageRating = parseFloat(((product.averageRating * (product.reviewCount + 1) - review.rating) /
                        product.reviewCount).toFixed(2));
                }
            }
            else {
                product.reviewCount = 0;
                product.averageRating = 0;
            }
            await em.persistAndFlush(product);
            await em.commit();
            return true;
        }
        catch (error) {
            await em.rollback();
            throw error;
        }
    }
};
exports.ReviewResolver = ReviewResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => Reviews_1.Review),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewInput, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "createReview", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedReviews),
    __param(0, (0, type_graphql_1.Arg)("slug")),
    __param(1, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int, { defaultValue: 10 })),
    __param(2, (0, type_graphql_1.Arg)("offset", () => type_graphql_1.Int, { defaultValue: 0 })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "productReviews", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Reviews_1.Review]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "userReviews", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("reviewId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "deleteReview", null);
exports.ReviewResolver = ReviewResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Reviews_1.Review)
], ReviewResolver);
//# sourceMappingURL=reviews.js.map