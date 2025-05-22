// import { EntityManager } from "@mikro-orm/core";
import { Resolver, InputType, Arg, Field, Ctx, Mutation, ObjectType, Query } from "type-graphql";
import argon2 from "argon2";
import { Company } from "../entities/Company";
import Redis from "ioredis";
import nodemailer from "nodemailer";
import { MyContext } from "src/types";
import { COOKIE_NAME } from "../constants";
import { FieldError } from "../shared/ferror";
import { User } from "../entities/User";

const redis = new Redis();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

@InputType()
class RegisterCompanyInput {
    @Field()
    cname!: string;

    @Field()
    username!: string;
    
    @Field()
    email!: string;
    
    @Field()
    password!: string;

    @Field()
    location!: string;
    
    @Field()
    contact!: number;
}

@InputType()
class LoginCompanyInput {
    @Field()
    cname!: string;

    @Field()
    email!: string;
    
    @Field()
    password!: string;
}

@InputType()
class VerifyCompanyInput {
    @Field()
    email!: string;
    
    @Field()
    code!: string;
}

@ObjectType()
class CompanyResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Company, { nullable: true })
    company?: Company;
}

@Resolver()
export class CompanyResolver {

    @Query(() => Company, { nullable: true })
    async me(@Ctx() { req, em }: MyContext) {
        if (!req.session.companyId) {
            return null;
        }
        return await em.findOne(Company, { id: req.session.companyId as string }, { populate: ["products"]});
    }

    @Mutation(() => CompanyResponse)
    async registerCompany(
        @Arg("options") options: RegisterCompanyInput,
        @Ctx() { em }: MyContext
    ): Promise<CompanyResponse> {
        const existingUser = await em.findOne(User, { email: options.email });
        const existingCompany = await em.findOne(Company, { cname: options.cname });
        if (existingCompany) {
            return { errors: [{ field: "cname", message: "Company name already taken" }] };
        }
        if (existingUser) {
            return { errors: [{ field: "email", message: "E-Mail is already registered for buyer account, use new email" }] };
        }
        if (options.password.length < 6) {
            return { errors: [{ field: "password", message: "Password must be at least 6 characters" }] };
        }

        const hashedPassword = await argon2.hash(options.password);
        const company = em.create(Company, {
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

    @Mutation(() => CompanyResponse)
    async verifyCompany(
        @Arg("input") input: VerifyCompanyInput,
        @Ctx() { em }: MyContext
    ): Promise<CompanyResponse> {
        const company = await em.findOne(Company, { email: input.email });

        if (!company) {
            return { errors: [{ field: "email", message: "Company not found" }] };
        }

        const storedEmailCode = await redis.get(`emailCode:${input.email}`);

        if (!storedEmailCode || input.code !== storedEmailCode) {
            return { errors: [{ field:
                 "code", message: "Invalid or expired verification code" }] };
        }

        company.isEmailVerified = true;
        await em.persistAndFlush(company);

        await redis.del(`emailCode:${input.email}`);

        return { company };
    }

    @Mutation(() => CompanyResponse)
    async loginCompany(
        @Arg("options") options: LoginCompanyInput,
        @Ctx() { em, req }: MyContext
    ): Promise<CompanyResponse> {
        const company = await em.findOne(Company,{cname: options.cname})

        const email = await em.findOne(Company,{email: options.email});

        const cname = await em.findOne(Company,{cname: options.cname});

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

        const valid = await argon2.verify(company.password, options.password);
        if (!valid) {
            return { errors: [{ field: "password", message: "Incorrect password" }] };
        }

        req.session.companyId = company.id;
        return { company };
    }

    @Mutation(() => Boolean)
    logoutCompany(@Ctx() { req, res }: MyContext) {
        if (!req.session.companyId) {
            return false;
        }
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }

    @Query(() => [Company])
    async getCompanies(@Ctx() { em }: MyContext): Promise<Company[]> {
        return em.find(Company, {}, {populate: ['products']});
    }
}
