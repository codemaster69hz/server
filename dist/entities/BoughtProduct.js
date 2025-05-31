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
exports.BoughtProduct = void 0;
const core_1 = require("@mikro-orm/core");
const Products_1 = require("./Products");
const User_1 = require("./User");
const type_graphql_1 = require("type-graphql");
let BoughtProduct = class BoughtProduct {
    constructor() {
        this.id = crypto.randomUUID();
        this.boughtAt = new Date();
    }
};
exports.BoughtProduct = BoughtProduct;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], BoughtProduct.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], BoughtProduct.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Products_1.Product),
    (0, core_1.ManyToOne)(() => Products_1.Product),
    __metadata("design:type", Products_1.Product)
], BoughtProduct.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], BoughtProduct.prototype, "boughtAt", void 0);
exports.BoughtProduct = BoughtProduct = __decorate([
    (0, core_1.Entity)()
], BoughtProduct);
//# sourceMappingURL=BoughtProduct.js.map