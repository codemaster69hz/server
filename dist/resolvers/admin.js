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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminResolver = void 0;
const type_graphql_1 = require("type-graphql");
const ferror_1 = require("../shared/ferror");
const constants_1 = require("../constants");
const Admin_1 = require("../entities/Admin");
const ioredis_1 = __importDefault(require("ioredis"));
const argon2_1 = __importDefault(require("argon2"));
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const redis = new ioredis_1.default();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
let AdminregInput = class AdminregInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminregInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminregInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminregInput.prototype, "password", void 0);
AdminregInput = __decorate([
    (0, type_graphql_1.InputType)()
], AdminregInput);
let AdminLoginInput = class AdminLoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminLoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminLoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminLoginInput.prototype, "password", void 0);
AdminLoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], AdminLoginInput);
let AdminVerifyCode = class AdminVerifyCode {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminVerifyCode.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminVerifyCode.prototype, "code", void 0);
AdminVerifyCode = __decorate([
    (0, type_graphql_1.InputType)()
], AdminVerifyCode);
let AdminResponse = class AdminResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [ferror_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], AdminResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Admin_1.Admin, { nullable: true }),
    __metadata("design:type", Admin_1.Admin)
], AdminResponse.prototype, "admin", void 0);
AdminResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AdminResponse);
let AdminResolver = class AdminResolver {
    async getadmin({ req, em }) {
        if (!req.session.adminId) {
            return null;
        }
        return await em.findOne(Admin_1.Admin, { id: req.session.adminId });
    }
    async adminregister(options, { em }) {
        const existingAdmin = await em.findOne(Admin_1.Admin, { email: options.email });
        if (existingAdmin) {
            return {
                errors: [{ field: "username", message: "Username already taken" }],
            };
        }
        if (options.username.length <= 3) {
            return {
                errors: [{ field: "username", message: "Username is too short" }],
            };
        }
        if (options.password.length <= 5) {
            return {
                errors: [{ field: "password", message: "Password is too short" }],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const admin = em.create(Admin_1.Admin, {
            username: options.username,
            password: hashedPassword,
            isEmailVerified: false,
            email: options.email,
        });
        await em.persistAndFlush(admin);
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`emailCode:${admin.email}`, emailCode, "EX", 600);
        console.log("Stored Email Code:", await redis.get(`emailCode:${admin.email}`));
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: admin.email,
                subject: "Verify Your Email",
                text: `Your verification code is: ${emailCode}`,
            });
        }
        catch (err) {
            console.error("Failed to send verification email:", err);
        }
        return { admin };
    }
    async adminCode(input, { em }) {
        const admin = await em.findOne(Admin_1.Admin, { email: input.email });
        if (!admin) {
            return { errors: [{ field: "email", message: "Admin not found" }] };
        }
        const storedEmailCode = await redis.get(`emailCode:${input.email}`);
        if (!storedEmailCode || input.code !== storedEmailCode) {
            return { errors: [{ field: "code", message: "Invalid or expired code" }] };
        }
        admin.isEmailVerified = true;
        await em.persistAndFlush(admin);
        await redis.del(`emailCode:${input.email}`);
        return { admin };
    }
    async adminLogin(options, { req, em }) {
        const admin = await em.findOne(Admin_1.Admin, { username: options.username });
        if (!admin) {
            return { errors: [{ field: "username", message: "Admin not found" }] };
        }
        if (admin.email !== options.email) {
            return { errors: [{ field: "email", message: "Invalid email" }] };
        }
        if (!admin.isEmailVerified) {
            return { errors: [{ field: "email", message: "Email not verified" }] };
        }
        const valid = await argon2_1.default.verify(admin.password, options.password);
        if (!valid) {
            return { errors: [{ field: "password", message: "Incorrect password" }] };
        }
        req.session.adminId = admin.id;
        return { admin };
    }
    adminLogout({ req, res }) {
        return new Promise((resolve) => {
            req.session.destroy((err) => {
                res.clearCookie(constants_1.COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
};
exports.AdminResolver = AdminResolver;
__decorate([
    (0, type_graphql_1.Query)(() => Admin_1.Admin, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getadmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminregInput, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminregister", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminVerifyCode, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminCode", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminLoginInput, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "adminLogout", null);
exports.AdminResolver = AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminResolver);
//# sourceMappingURL=admin.js.map