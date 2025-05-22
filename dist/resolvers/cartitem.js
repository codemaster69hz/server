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
exports.CartResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Cart_1 = require("../entities/Cart");
const CartItem_1 = require("../entities/CartItem");
const Products_1 = require("../entities/Products");
const ProductVar_1 = require("../entities/ProductVar");
const User_1 = require("../entities/User");
let CartResolver = class CartResolver {
    async getCart({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const cart = await em.findOne(Cart_1.Cart, { user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation'] });
        return cart;
    }
    async addToCart(productId, quantity, variationId, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const userId = req.session.userId;
        let cart = await em.findOne(Cart_1.Cart, { user: userId });
        if (!cart) {
            const user = await em.findOneOrFail(User_1.User, { id: userId });
            cart = em.create(Cart_1.Cart, {
                user,
                createdAt: new Date(),
                updatedAt: new Date(),
                total: 0
            });
            await em.persistAndFlush(cart);
        }
        const product = await em.findOneOrFail(Products_1.Product, { id: productId });
        let variation = null;
        let price = product.price;
        let size;
        if (variationId) {
            variation = await em.findOneOrFail(ProductVar_1.ProductVariation, { id: variationId });
            if (variation.product.id !== product.id) {
                throw new Error("Variation does not belong to the product");
            }
            price = variation.price;
            size = variation.size;
        }
        const existingItem = await em.findOne(CartItem_1.CartItem, {
            cart: cart.id,
            product: product.id,
            variation: variation !== null && variation !== void 0 ? variation : null
        });
        if (existingItem) {
            existingItem.quantity += quantity;
            await em.persistAndFlush(existingItem);
            return existingItem;
        }
        const cartItem = em.create(CartItem_1.CartItem, {
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
    async clearCart({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const cart = await em.findOne(Cart_1.Cart, { user: req.session.userId }, { populate: ['items'] });
        if (!cart)
            throw new Error("Cart not found");
        await em.removeAndFlush(cart.items.getItems());
        return true;
    }
    async isCartReadyForCheckout({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const cart = await em.findOne(Cart_1.Cart, { user: req.session.userId }, { populate: ['items'] });
        if (!cart || cart.items.length === 0) {
            return false;
        }
        return true;
    }
};
exports.CartResolver = CartResolver;
__decorate([
    (0, type_graphql_1.Query)(() => Cart_1.Cart, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "getCart", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CartItem_1.CartItem),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Arg)("quantity", () => Number)),
    __param(2, (0, type_graphql_1.Arg)("variationId", { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addToCart", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "clearCart", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "isCartReadyForCheckout", null);
exports.CartResolver = CartResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Cart_1.Cart)
], CartResolver);
//# sourceMappingURL=cartitem.js.map