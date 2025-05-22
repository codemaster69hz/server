import {
    Resolver,
    Mutation,
    Arg,
    Ctx,
    ObjectType,
    Field,
    InputType,
    Query,
  } from "type-graphql";
  import { MyContext } from "src/types";
  import { FieldError } from "../shared/ferror";
  import { COOKIE_NAME } from "../constants";
  import { Admin } from "../entities/Admin";
  import Redis from "ioredis";
  import argon2 from "argon2";
  import nodemailer from "nodemailer";
  
  require("dotenv").config();
  
  const redis = new Redis();
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  @InputType()
  class AdminregInput {
    @Field()
    username!: string;
  
    @Field()
    email!: string;
  
    @Field()
    password!: string;
  }
  
  @InputType()
  class AdminLoginInput {
    @Field()
    username!: string;
  
    @Field()
    email!: string;
  
    @Field()
    password!: string;
  }
  
  @InputType()
  class AdminVerifyCode {
    @Field()
    email!: string;
  
    @Field()
    code!: string;
  }
  
  @ObjectType()
  class AdminResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
  
    @Field(() => Admin, { nullable: true })
    admin?: Admin;
  }
  
  @Resolver()
  export class AdminResolver {
    @Query(() => Admin, { nullable: true })
    async getadmin(@Ctx() { req, em }: MyContext) {
      if (!req.session.adminId) {
        return null;
      }
      return await em.findOne(Admin, { id: req.session.adminId as string });
    }
  
    @Mutation(() => AdminResponse)
    async adminregister(
      @Arg("options") options: AdminregInput,
      @Ctx() { em }: MyContext
    ): Promise<AdminResponse> {
      const existingAdmin = await em.findOne(Admin, { email: options.email });
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
  
      const hashedPassword = await argon2.hash(options.password);
      const admin = em.create(Admin, {
        username: options.username,
        password: hashedPassword,
        isEmailVerified: false,
        email: options.email,
      });
  
      await em.persistAndFlush(admin);
  
      const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(`emailCode:${admin.email}`, emailCode, "EX", 600); // 10 min
  
      console.log("Stored Email Code:", await redis.get(`emailCode:${admin.email}`));
  
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.email,
          subject: "Verify Your Email",
          text: `Your verification code is: ${emailCode}`,
        });
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }
  
      return { admin };
    }
  
    @Mutation(() => AdminResponse)
    async adminCode(
      @Arg("input") input: AdminVerifyCode,
      @Ctx() { em }: MyContext
    ): Promise<AdminResponse> {
      const admin = await em.findOne(Admin, { email: input.email });
  
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
  
    @Mutation(() => AdminResponse)
    async adminLogin(
      @Arg("options") options: AdminLoginInput,
      @Ctx() { req, em }: MyContext
    ): Promise<AdminResponse> {
      const admin = await em.findOne(Admin, { username: options.username });
  
      if (!admin) {
        return { errors: [{ field: "username", message: "Admin not found" }] };
      }
  
      if (admin.email !== options.email) {
        return { errors: [{ field: "email", message: "Invalid email" }] };
      }
  
      if (!admin.isEmailVerified) {
        return { errors: [{ field: "email", message: "Email not verified" }] };
      }
  
      const valid = await argon2.verify(admin.password, options.password);
      if (!valid) {
        return { errors: [{ field: "password", message: "Incorrect password" }] };
      }
  
      req.session.adminId = admin.id;
      return { admin };
    }
  
    @Mutation(() => Boolean)
    adminLogout(@Ctx() { req, res }: MyContext): Promise<boolean> {
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          res.clearCookie(COOKIE_NAME);
          if (err) {
            console.log(err);
            resolve(false);
          }
          resolve(true);
        });
      });
    }
  }
  