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
exports.ReviewSentiment = exports.Review = void 0;
const core_1 = require("@mikro-orm/core");
const User_1 = require("./User");
const type_graphql_1 = require("type-graphql");
const Products_1 = require("./Products");
let Review = class Review {
    constructor() {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
    }
};
exports.Review = Review;
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, core_1.PrimaryKey)({ type: "uuid" }),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.Int], { nullable: true }),
    (0, core_1.Property)({ type: 'integer[]', nullable: true }),
    __metadata("design:type", Array)
], Review.prototype, "ratingDistribution", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Products_1.Product),
    (0, core_1.ManyToOne)(() => Products_1.Product),
    __metadata("design:type", Products_1.Product)
], Review.prototype, "product", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ReviewSentiment),
    (0, core_1.Property)({ type: "string" }),
    __metadata("design:type", String)
], Review.prototype, "sentiment", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
exports.Review = Review = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Review);
var ReviewSentiment;
(function (ReviewSentiment) {
    ReviewSentiment["POSITIVE"] = "POSITIVE";
    ReviewSentiment["NEUTRAL"] = "NEUTRAL";
    ReviewSentiment["NEGATIVE"] = "NEGATIVE";
})(ReviewSentiment || (exports.ReviewSentiment = ReviewSentiment = {}));
(0, type_graphql_1.registerEnumType)(ReviewSentiment, {
    name: "ReviewSentiment",
    description: "Sentiment of the review",
});
//# sourceMappingURL=Reviews.js.map