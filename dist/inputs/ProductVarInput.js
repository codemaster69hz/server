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
exports.UpdateProductVariations = exports.ProductVariationInput = void 0;
const type_graphql_1 = require("type-graphql");
let ProductVariationInput = class ProductVariationInput {
};
exports.ProductVariationInput = ProductVariationInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductVariationInput.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductVariationInput.prototype, "color", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ProductVariationInput.prototype, "price", void 0);
exports.ProductVariationInput = ProductVariationInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductVariationInput);
let UpdateProductVariations = class UpdateProductVariations {
};
exports.UpdateProductVariations = UpdateProductVariations;
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateProductVariations.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateProductVariations.prototype, "color", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UpdateProductVariations.prototype, "price", void 0);
exports.UpdateProductVariations = UpdateProductVariations = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateProductVariations);
//# sourceMappingURL=ProductVarInput.js.map