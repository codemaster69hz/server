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
exports.UserAddress = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
let UserAddress = class UserAddress {
    constructor() {
        this.id = crypto.randomUUID();
        this.isDefaultShipping = false;
        this.isDefaultBilling = false;
    }
};
exports.UserAddress = UserAddress;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], UserAddress.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User, {
        index: true
    }),
    __metadata("design:type", User_1.User)
], UserAddress.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "streetAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "streetAddress2", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "country", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], UserAddress.prototype, "zipcode", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: false }),
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], UserAddress.prototype, "isDefaultShipping", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: false }),
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], UserAddress.prototype, "isDefaultBilling", void 0);
exports.UserAddress = UserAddress = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], UserAddress);
//# sourceMappingURL=UserAddress.js.map