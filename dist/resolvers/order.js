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
exports.OrderResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Order_1 = require("../entities/Order");
const OrderItem_1 = require("../entities/OrderItem");
const Cart_1 = require("../entities/Cart");
const User_1 = require("../entities/User");
const UserAddress_1 = require("../entities/UserAddress");
let OrderResolver = class OrderResolver {
    async getOrders({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        return await em.find(Order_1.Order, { user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation', 'shippingAddress', 'billingAddress'] });
    }
    async getOrder(id, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        return await em.findOne(Order_1.Order, { id, user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation', 'shippingAddress', 'billingAddress'] });
    }
    async createOrder(shippingAddressId, billingAddressId, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const [cart, user, shippingAddress, billingAddress] = await Promise.all([
            em.findOne(Cart_1.Cart, { user: req.session.userId }, { populate: ['items', 'items.product', 'items.variation'] }),
            em.findOneOrFail(User_1.User, { id: req.session.userId }),
            em.findOneOrFail(UserAddress_1.UserAddress, { id: shippingAddressId }),
            em.findOneOrFail(UserAddress_1.UserAddress, { id: billingAddressId }),
        ]);
        if (!cart)
            throw new Error("Cart not found");
        if (cart.items.length === 0)
            throw new Error("Cannot create order from empty cart");
        const order = em.create(Order_1.Order, {
            user,
            status: Order_1.OrderStatus.PROCESSING,
            shippingAddress,
            billingAddress,
            total: cart.total,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        for (const cartItem of cart.items.getItems()) {
            const orderItem = em.create(OrderItem_1.OrderItem, {
                product: cartItem.product,
                variation: cartItem.variation || undefined,
                quantity: cartItem.quantity,
                price: cartItem.price,
                size: cartItem.size,
                order,
                createdAt: new Date()
            });
            order.items.add(orderItem);
        }
        await em.removeAndFlush(cart.items.getItems());
        await em.removeAndFlush(cart);
        await em.persistAndFlush(order);
        return order;
    }
    async updateOrderStatus(orderId, status, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const order = await em.findOneOrFail(Order_1.Order, {
            id: orderId,
            user: req.session.userId
        });
        order.status = status;
        await em.persistAndFlush(order);
        return order;
    }
};
exports.OrderResolver = OrderResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Order_1.Order]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrders", null);
__decorate([
    (0, type_graphql_1.Query)(() => Order_1.Order, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "getOrder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Order_1.Order),
    __param(0, (0, type_graphql_1.Arg)("shippingAddressId")),
    __param(1, (0, type_graphql_1.Arg)("billingAddressId")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Order_1.Order),
    __param(0, (0, type_graphql_1.Arg)("orderId")),
    __param(1, (0, type_graphql_1.Arg)("status")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OrderResolver.prototype, "updateOrderStatus", null);
exports.OrderResolver = OrderResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Order_1.Order)
], OrderResolver);
//# sourceMappingURL=order.js.map