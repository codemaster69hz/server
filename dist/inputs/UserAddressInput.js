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
exports.UpdateUserAddressInput = exports.UserAddressInput = void 0;
const type_graphql_1 = require("type-graphql");
let UserAddressInput = class UserAddressInput {
};
exports.UserAddressInput = UserAddressInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "streetAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "streetAddress2", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "country", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAddressInput.prototype, "zipcode", void 0);
exports.UserAddressInput = UserAddressInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserAddressInput);
let UpdateUserAddressInput = class UpdateUserAddressInput {
};
exports.UpdateUserAddressInput = UpdateUserAddressInput;
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "streetAddress", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "streetAddress2", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "state", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "country", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateUserAddressInput.prototype, "zipcode", void 0);
exports.UpdateUserAddressInput = UpdateUserAddressInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateUserAddressInput);
//# sourceMappingURL=UserAddressInput.js.map