"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = exports.SESSION_SECRET = exports.__prod__ = void 0;
require("dotenv").config();
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.COOKIE_NAME = process.env.COOKIE_NAME;
//# sourceMappingURL=constants.js.map