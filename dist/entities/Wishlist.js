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
exports.Wishlist = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const WishlistItem_1 = require("./WishlistItem");
let Wishlist = class Wishlist {
    constructor() {
        this.id = crypto.randomUUID();
        this.items = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.Wishlist = Wishlist;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Wishlist.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Wishlist.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [WishlistItem_1.WishlistItem]),
    (0, core_1.OneToMany)(() => WishlistItem_1.WishlistItem, item => item.wishlist, { eager: true }),
    __metadata("design:type", Object)
], Wishlist.prototype, "items", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Wishlist.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Wishlist.prototype, "updatedAt", void 0);
exports.Wishlist = Wishlist = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Wishlist);
//# sourceMappingURL=Wishlist.js.map