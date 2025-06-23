"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDomestic = isDomestic;
exports.getEstimatedDeliveryDate = getEstimatedDeliveryDate;
function isDomestic(country) {
    return country === "United States";
}
function getEstimatedDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate;
}
//# sourceMappingURL=shipping.js.map