"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressOrDefault = getAddressOrDefault;
const UserAddress_1 = require("../entities/UserAddress");
async function getAddressOrDefault(em, userId, providedId, type) {
    if (providedId) {
        return await em.findOneOrFail(UserAddress_1.UserAddress, { id: providedId, user: userId });
    }
    return await em.findOneOrFail(UserAddress_1.UserAddress, Object.assign({ user: userId }, (type === "shipping"
        ? { isDefaultShipping: true }
        : { isDefaultBilling: true })));
}
//# sourceMappingURL=addressHelpers.js.map