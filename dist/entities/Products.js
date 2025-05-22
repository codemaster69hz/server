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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Category_1 = require("./Category");
const ProductVar_1 = require("../entities/ProductVar");
const Company_1 = require("./Company");
const slugify_1 = __importDefault(require("slugify"));
const Reviews_1 = require("./Reviews");
let Product = class Product {
    constructor() {
        this.id = crypto.randomUUID();
        this.variations = new core_1.Collection(this);
        this.reviews = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    generateSlug() {
        if (!this.slug) {
            this.slug = (0, slugify_1.default)(this.name, { lower: true, strict: true });
        }
    }
};
exports.Product = Product;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ unique: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ type: "decimal" }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Product.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Product.prototype, "material", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ type: "text" }),
    __metadata("design:type", String)
], Product.prototype, "weight", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Category_1.Category),
    (0, core_1.ManyToOne)(() => Category_1.Category),
    __metadata("design:type", Category_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Category_1.Category),
    (0, core_1.ManyToOne)(() => Category_1.Category),
    __metadata("design:type", String)
], Product.prototype, "subcategory", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductVar_1.ProductVariation]),
    (0, core_1.OneToMany)(() => ProductVar_1.ProductVariation, (variation) => variation.product),
    __metadata("design:type", Object)
], Product.prototype, "variations", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Company_1.Company),
    (0, core_1.ManyToOne)(() => Company_1.Company),
    __metadata("design:type", Company_1.Company)
], Product.prototype, "company", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Reviews_1.Review]),
    (0, core_1.OneToMany)(() => Reviews_1.Review, (review) => review.product),
    __metadata("design:type", Object)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "averageRating", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "reviewCount", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "generateSlug", null);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Product);
//# sourceMappingURL=Products.js.map