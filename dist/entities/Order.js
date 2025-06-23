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
exports.Order = exports.OrderStatus = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const OrderItem_1 = require("./OrderItem");
const type_graphql_2 = require("type-graphql");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
(0, type_graphql_2.registerEnumType)(OrderStatus, {
    name: "OrderStatus",
    description: "The status of the order"
});
let Order = class Order {
    constructor() {
        this.id = crypto.randomUUID();
        this.items = new core_1.Collection(this);
        this.status = OrderStatus.PENDING;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.estimatedDeliveryDate = new Date();
    }
};
exports.Order = Order;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [OrderItem_1.OrderItem]),
    (0, core_1.OneToMany)(() => OrderItem_1.OrderItem, item => item.order, { eager: true }),
    __metadata("design:type", Object)
], Order.prototype, "items", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => OrderStatus),
    (0, core_1.Enum)(() => OrderStatus),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Order.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    (0, core_1.Property)({ type: "decimal" }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
exports.Order = Order = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Order);
//# sourceMappingURL=Order.js.map