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
exports.BoughtProductResolver = void 0;
const type_graphql_1 = require("type-graphql");
const BoughtProduct_1 = require("../entities/BoughtProduct");
const Products_1 = require("../entities/Products");
let BoughtProductResolver = class BoughtProductResolver {
    async hasUserBoughtProduct(productId, { em, req }) {
        const userId = req.session.userId;
        if (!userId)
            throw new Error("Not authenticated");
        const bought = await em.findOne(BoughtProduct_1.BoughtProduct, {
            user: userId,
            product: productId,
        });
        return !!bought;
    }
    async getBoughtProducts({ em, req }) {
        const userId = req.session.userId;
        if (!userId)
            throw new Error("Not authenticated");
        const records = await em.find(BoughtProduct_1.BoughtProduct, {
            user: userId
        }, { populate: ['product'] });
        return records.map(r => r.product);
    }
};
exports.BoughtProductResolver = BoughtProductResolver;
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoughtProductResolver.prototype, "hasUserBoughtProduct", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Products_1.Product]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoughtProductResolver.prototype, "getBoughtProducts", null);
exports.BoughtProductResolver = BoughtProductResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BoughtProductResolver);
//# sourceMappingURL=boughtproduct.js.map