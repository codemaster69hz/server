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
exports.Cart = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const CartItem_1 = require("./CartItem");
let Cart = class Cart {
    constructor() {
        this.id = crypto.randomUUID();
        this.items = new core_1.Collection(this);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    get total() {
        return this.items.getItems().reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
};
exports.Cart = Cart;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Cart.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Cart.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [CartItem_1.CartItem]),
    (0, core_1.OneToMany)(() => CartItem_1.CartItem, item => item.cart, { eager: true }),
    __metadata("design:type", Object)
], Cart.prototype, "items", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Cart.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Cart.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Cart.prototype, "total", null);
exports.Cart = Cart = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Cart);
//# sourceMappingURL=Cart.js.map