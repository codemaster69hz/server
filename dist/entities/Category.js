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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Products_1 = require("./Products");
let Category = class Category {
    constructor() {
        this.id = crypto.randomUUID();
        this.subcategories = new core_1.Collection(this);
        this.products = new core_1.Collection(this);
        this.createdAt = new Date();
    }
};
exports.Category = Category;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ unique: true }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "parentCategoryId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Category, { nullable: true }),
    (0, core_1.ManyToOne)(() => Category, { nullable: true, fieldName: "parentCategoryId" }),
    __metadata("design:type", Category)
], Category.prototype, "parentCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Category], { nullable: true }),
    (0, core_1.OneToMany)(() => Category, (category) => category.parentCategory),
    __metadata("design:type", Object)
], Category.prototype, "subcategories", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Products_1.Product]),
    (0, core_1.OneToMany)(() => Products_1.Product, (product) => product.category),
    __metadata("design:type", Object)
], Category.prototype, "products", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
exports.Category = Category = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Category);
//# sourceMappingURL=Category.js.map