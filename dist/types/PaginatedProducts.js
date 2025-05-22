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
exports.PaginatedProducts = void 0;
const type_graphql_1 = require("type-graphql");
const Products_1 = require("../entities/Products");
let PaginatedProducts = class PaginatedProducts {
};
exports.PaginatedProducts = PaginatedProducts;
__decorate([
    (0, type_graphql_1.Field)(() => [Products_1.Product]),
    __metadata("design:type", Array)
], PaginatedProducts.prototype, "products", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PaginatedProducts.prototype, "hasMore", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], PaginatedProducts.prototype, "nextCursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PaginatedProducts.prototype, "total", void 0);
exports.PaginatedProducts = PaginatedProducts = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedProducts);
//# sourceMappingURL=PaginatedProducts.js.map