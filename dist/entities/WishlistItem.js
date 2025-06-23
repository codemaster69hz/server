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
exports.WishlistItem = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Wishlist_1 = require("./Wishlist");
const Products_1 = require("./Products");
const ProductVar_1 = require("./ProductVar");
let WishlistItem = class WishlistItem {
    constructor() {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.WishlistItem = WishlistItem;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], WishlistItem.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Products_1.Product),
    (0, core_1.ManyToOne)(() => Products_1.Product),
    __metadata("design:type", Products_1.Product)
], WishlistItem.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ProductVar_1.ProductVariation, { nullable: true }),
    (0, core_1.ManyToOne)(() => ProductVar_1.ProductVariation, { nullable: true }),
    __metadata("design:type", ProductVar_1.ProductVariation)
], WishlistItem.prototype, "variation", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    (0, core_1.Property)({ type: "decimal" }),
    __metadata("design:type", Number)
], WishlistItem.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], WishlistItem.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Wishlist_1.Wishlist),
    (0, core_1.ManyToOne)(() => Wishlist_1.Wishlist),
    __metadata("design:type", Wishlist_1.Wishlist)
], WishlistItem.prototype, "wishlist", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], WishlistItem.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], WishlistItem.prototype, "updatedAt", void 0);
exports.WishlistItem = WishlistItem = __decorate([
    (0, core_1.Unique)({ properties: ['product', 'variation', 'wishlist'] }),
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], WishlistItem);
//# sourceMappingURL=WishlistItem.js.map