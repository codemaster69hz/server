"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const constants_1 = require("./constants");
const postgresql_1 = require("@mikro-orm/postgresql");
const path_1 = __importDefault(require("path"));
const Company_1 = require("./entities/Company");
const ProductVar_1 = require("./entities/ProductVar");
const Category_1 = require("./entities/Category");
const Products_1 = require("./entities/Products");
const Admin_1 = require("./entities/Admin");
const CartItem_1 = require("./entities/CartItem");
const Reviews_1 = require("./entities/Reviews");
const UserAddress_1 = require("./entities/UserAddress");
exports.default = (0, postgresql_1.defineConfig)({
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post_1.Post, User_1.User, Company_1.Company, Products_1.Product, ProductVar_1.ProductVariation, UserAddress_1.UserAddress, Category_1.Category, Admin_1.Admin, CartItem_1.CartItem, Reviews_1.Review],
    dbName: 'rkcdb',
    allowGlobalContext: true,
    password: '12345678',
    namingStrategy: postgresql_1.UnderscoreNamingStrategy,
    debug: !constants_1.__prod__,
});
//# sourceMappingURL=mikro-orm.config.js.map