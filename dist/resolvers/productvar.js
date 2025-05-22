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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariationResolver = void 0;
const type_graphql_1 = require("type-graphql");
const ProductVar_1 = require("../entities/ProductVar");
const Products_1 = require("../entities/Products");
const slugify_1 = __importDefault(require("slugify"));
const ProductVarInput_1 = require("../inputs/ProductVarInput");
let ProductVariationResolver = class ProductVariationResolver {
    async productVariations({ em }) {
        return await em.find(ProductVar_1.ProductVariation, {});
    }
    async productVariation(id, { em }) {
        return await em.findOne(ProductVar_1.ProductVariation, { id });
    }
    async getUniqueSizes({ em }) {
        const knex = em.getConnection().getKnex();
        const result = await knex("product_variation").distinct("size");
        return result.map((row) => row.size);
    }
    async createProductVariation(size, color, price, productId, { em }) {
        const product = await em.findOne(Products_1.Product, { id: productId });
        if (!product) {
            throw new Error("Product not found");
        }
        const slug = (0, slugify_1.default)(`${product.slug}-${size}-${color}`, { lower: true, strict: true });
        const productVariation = em.create(ProductVar_1.ProductVariation, {
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
    async updateProductVar(id, input, { em, req }) {
        if (!req.session.companyId) {
            throw new Error("Not authenticated");
        }
        const provar = await em.findOne(ProductVar_1.ProductVariation, { id });
        if (!provar) {
            throw new Error("Variation doesn't exists");
        }
        em.assign(provar, input);
        await em.flush();
        return provar;
    }
    async productBySlugVariations(slug, { em }) {
        return await em.findOne(ProductVar_1.ProductVariation, { slug });
    }
};
exports.ProductVariationResolver = ProductVariationResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [ProductVar_1.ProductVariation]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "productVariations", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProductVar_1.ProductVariation, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "productVariation", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "getUniqueSizes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductVar_1.ProductVariation),
    __param(0, (0, type_graphql_1.Arg)("size")),
    __param(1, (0, type_graphql_1.Arg)("color")),
    __param(2, (0, type_graphql_1.Arg)("price")),
    __param(3, (0, type_graphql_1.Arg)("productId")),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "createProductVariation", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProductVar_1.ProductVariation),
    __param(0, (0, type_graphql_1.Arg)("variationid")),
    __param(1, (0, type_graphql_1.Arg)("input", () => ProductVarInput_1.UpdateProductVariations)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ProductVarInput_1.UpdateProductVariations, Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "updateProductVar", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProductVar_1.ProductVariation, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("slug")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductVariationResolver.prototype, "productBySlugVariations", null);
exports.ProductVariationResolver = ProductVariationResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ProductVariationResolver);
//# sourceMappingURL=productvar.js.map