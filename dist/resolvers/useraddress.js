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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddressResolver = void 0;
const UserAddress_1 = require("../entities/UserAddress");
const type_graphql_1 = require("type-graphql");
const UserAddressInput_1 = require("../inputs/UserAddressInput");
const User_1 = require("../entities/User");
let UserAddressResolver = class UserAddressResolver {
    async userAddressList({ em }) {
        return await em.find(UserAddress_1.UserAddress, {});
    }
    async userAddress(id, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const address = await em.findOne(UserAddress_1.UserAddress, { id }, { populate: ["user"] });
        if (!address || address.user.id !== req.session.userId) {
            throw new Error("Not found");
        }
        return address;
    }
    async createUserAddress(input, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const user = await em.findOne(User_1.User, { id: req.session.userId });
        if (!user)
            throw new Error("User not found");
        const address = em.create(UserAddress_1.UserAddress, Object.assign(Object.assign({}, input), { user, isDefaultShipping: false, isDefaultBilling: false }));
        await em.persistAndFlush(address);
        return address;
    }
    async updateUserAddress(id, input, { em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        const address = await em.findOne(UserAddress_1.UserAddress, { id }, { populate: ["user"] });
        if (!address) {
            throw new Error("Address not found");
        }
        if (address.user.id !== req.session.userId) {
            throw new Error("Not authorized");
        }
        em.assign(address, input);
        await em.persistAndFlush(address);
        return address;
    }
    async myAddresses({ em, req }) {
        if (!req.session.userId) {
            throw new Error("Not authenticated");
        }
        return await em.find(UserAddress_1.UserAddress, {
            user: req.session.userId,
        });
    }
};
exports.UserAddressResolver = UserAddressResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [UserAddress_1.UserAddress]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAddressResolver.prototype, "userAddressList", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserAddress_1.UserAddress, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserAddressResolver.prototype, "userAddress", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserAddress_1.UserAddress),
    __param(0, (0, type_graphql_1.Arg)("input", () => UserAddressInput_1.UserAddressInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserAddressInput_1.UserAddressInput, Object]),
    __metadata("design:returntype", Promise)
], UserAddressResolver.prototype, "createUserAddress", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserAddress_1.UserAddress),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("input", () => UserAddressInput_1.UpdateUserAddressInput)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UserAddressInput_1.UpdateUserAddressInput, Object]),
    __metadata("design:returntype", Promise)
], UserAddressResolver.prototype, "updateUserAddress", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserAddress_1.UserAddress]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAddressResolver.prototype, "myAddresses", null);
exports.UserAddressResolver = UserAddressResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserAddressResolver);
//# sourceMappingURL=useraddress.js.map