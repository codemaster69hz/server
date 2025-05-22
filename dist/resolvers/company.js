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
exports.CompanyResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const Company_1 = require("../entities/Company");
const ioredis_1 = __importDefault(require("ioredis"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("../constants");
const ferror_1 = require("../shared/ferror");
const User_1 = require("../entities/User");
const redis = new ioredis_1.default();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
let RegisterCompanyInput = class RegisterCompanyInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterCompanyInput.prototype, "cname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterCompanyInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterCompanyInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterCompanyInput.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RegisterCompanyInput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], RegisterCompanyInput.prototype, "contact", void 0);
RegisterCompanyInput = __decorate([
    (0, type_graphql_1.InputType)()
], RegisterCompanyInput);
let LoginCompanyInput = class LoginCompanyInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginCompanyInput.prototype, "cname", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginCompanyInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginCompanyInput.prototype, "password", void 0);
LoginCompanyInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginCompanyInput);
let VerifyCompanyInput = class VerifyCompanyInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VerifyCompanyInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], VerifyCompanyInput.prototype, "code", void 0);
VerifyCompanyInput = __decorate([
    (0, type_graphql_1.InputType)()
], VerifyCompanyInput);
let CompanyResponse = class CompanyResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [ferror_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CompanyResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Company_1.Company, { nullable: true }),
    __metadata("design:type", Company_1.Company)
], CompanyResponse.prototype, "company", void 0);
CompanyResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CompanyResponse);
let CompanyResolver = class CompanyResolver {
    async me({ req, em }) {
        if (!req.session.companyId) {
            return null;
        }
        return await em.findOne(Company_1.Company, { id: req.session.companyId }, { populate: ["products"] });
    }
    async registerCompany(options, { em }) {
        const existingUser = await em.findOne(User_1.User, { email: options.email });
        const existingCompany = await em.findOne(Company_1.Company, { cname: options.cname });
        if (existingCompany) {
            return { errors: [{ field: "cname", message: "Company name already taken" }] };
        }
        if (existingUser) {
            return { errors: [{ field: "email", message: "E-Mail is already registered for buyer account, use new email" }] };
        }
        if (options.password.length < 6) {
            return { errors: [{ field: "password", message: "Password must be at least 6 characters" }] };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const company = em.create(Company_1.Company, {
            cname: options.cname,
            email: options.email,
            password: hashedPassword,
            contact: options.contact,
            location: options.location,
            isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            username: options.username,
            products: "",
        });
        await em.persistAndFlush(company);
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        await redis.set(`emailCode:${company.email}`, emailCode, "EX", 600);
        console.log("Stored Email Code:", await redis.get(`emailCode:${company.email}`));
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: company.email,
            subject: "Verify Your Company Account",
            text: `Your verification code is: ${emailCode}`,
        });
        return { company };
    }
    async verifyCompany(input, { em }) {
        const company = await em.findOne(Company_1.Company, { email: input.email });
        if (!company) {
            return { errors: [{ field: "email", message: "Company not found" }] };
        }
        const storedEmailCode = await redis.get(`emailCode:${input.email}`);
        if (!storedEmailCode || input.code !== storedEmailCode) {
            return { errors: [{ field: "code", message: "Invalid or expired verification code" }] };
        }
        company.isEmailVerified = true;
        await em.persistAndFlush(company);
        await redis.del(`emailCode:${input.email}`);
        return { company };
    }
    async loginCompany(options, { em, req }) {
        const company = await em.findOne(Company_1.Company, { cname: options.cname });
        const email = await em.findOne(Company_1.Company, { email: options.email });
        const cname = await em.findOne(Company_1.Company, { cname: options.cname });
        if (!company) {
            return { errors: [{ field: "cname", message: "Company not found" }] };
        }
        if (!cname) {
            return { errors: [{ field: "cname", message: "Invalid name" }] };
        }
        if (!email) {
            return { errors: [{ field: "email", message: "Invalid Email" }] };
        }
        if (!company.isEmailVerified) {
            return { errors: [{ field: "verification", message: "Company email not verified" }] };
        }
        const valid = await argon2_1.default.verify(company.password, options.password);
        if (!valid) {
            return { errors: [{ field: "password", message: "Incorrect password" }] };
        }
        req.session.companyId = company.id;
        return { company };
    }
    logoutCompany({ req, res }) {
        if (!req.session.companyId) {
            return false;
        }
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    async getCompanies({ em }) {
        return em.find(Company_1.Company, {}, { populate: ['products'] });
    }
};
exports.CompanyResolver = CompanyResolver;
__decorate([
    (0, type_graphql_1.Query)(() => Company_1.Company, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CompanyResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterCompanyInput, Object]),
    __metadata("design:returntype", Promise)
], CompanyResolver.prototype, "registerCompany", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CompanyResponse),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyCompanyInput, Object]),
    __metadata("design:returntype", Promise)
], CompanyResolver.prototype, "verifyCompany", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CompanyResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginCompanyInput, Object]),
    __metadata("design:returntype", Promise)
], CompanyResolver.prototype, "loginCompany", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompanyResolver.prototype, "logoutCompany", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Company_1.Company]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyResolver.prototype, "getCompanies", null);
exports.CompanyResolver = CompanyResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CompanyResolver);
//# sourceMappingURL=company.js.map