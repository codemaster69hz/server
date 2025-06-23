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
exports.WishlistResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Wishlist_1 = require("../entities/Wishlist");
const Products_1 = require("../entities/Products");
const User_1 = require("../entities/User");
const WishlistItem_1 = require("../entities/WishlistItem");
const ProductVar_1 = require("../entities/ProductVar");
let WishlistResolver = class WishlistResolver {
    async getWishlist({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const wishlist = await em.findOne(Wishlist_1.Wishlist, { user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation'] });
        return wishlist;
    }
    async addtoWishlist(productId, variationId, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const userId = req.session.userId;
        let wishlist = await em.findOne(Wishlist_1.Wishlist, { user: userId });
        if (!wishlist) {
            const user = await em.findOneOrFail(User_1.User, { id: userId });
            wishlist = em.create(Wishlist_1.Wishlist, {
                user,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await em.persistAndFlush(wishlist);
        }
        const product = await em.findOneOrFail(Products_1.Product, { id: productId });
        let variation = null;
        let price = product.price;
        if (variationId) {
            variation = await em.findOneOrFail(ProductVar_1.ProductVariation, { id: variationId });
            if (variation.product.id !== product.id) {
                throw new Error("Variation doesn't exist");
            }
            price = variation.price;
        }
        const wishlistItem = em.create(WishlistItem_1.WishlistItem, {
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
    async clearWishlist({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const wishlist = await em.findOne(Wishlist_1.Wishlist, { user: req.session.userId }, { populate: ['items'] });
        if (!wishlist) {
            throw new Error("Wishlist not found");
        }
        await em.removeAndFlush(wishlist.items.getItems());
        wishlist.updatedAt = new Date();
        await em.persistAndFlush(wishlist);
        return true;
    }
};
exports.WishlistResolver = WishlistResolver;
__decorate([
    (0, type_graphql_1.Query)(() => Wishlist_1.Wishlist, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "getWishlist", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => WishlistItem_1.WishlistItem),
    __param(0, (0, type_graphql_1.Arg)("productId", () => String)),
    __param(1, (0, type_graphql_1.Arg)("variationId", () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "addtoWishlist", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistResolver.prototype, "clearWishlist", null);
exports.WishlistResolver = WishlistResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WishlistResolver);
//# sourceMappingURL=wishlist.js.map