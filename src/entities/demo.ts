// import { User } from "../entities/User";
// import { Company } from "../entities/Company";
// require("dotenv").config();
// import { MyContext } from "src/types";
// import { Resolver, InputType, Arg, Field, Ctx, Mutation, ObjectType, Query } from "type-graphql";
// import argon2 from "argon2";
// import { COOKIE_NAME } from "../constants";
// import Redis from "ioredis";
// import nodemailer from "nodemailer";
// import { FieldError } from "../shared/ferror";

// const redis = new Redis();

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Type for location data
// @ObjectType()
// class LocationData {
//     @Field(() => String, { nullable: true })
//     ip?: string;

//     @Field(() => String, { nullable: true })
//     country?: string;

//     @Field(() => String, { nullable: true })
//     city?: string;

//     @Field(() => String, { nullable: true })
//     region?: string;

//     @Field(() => Number, { nullable: true })
//     latitude?: number;

//     @Field(() => Number, { nullable: true })
//     longitude?: number;
// }

// @InputType()
// class RegisterInput {
//     @Field()
//     username!: string;
    
//     @Field()
//     email!: string;
    
//     @Field()
//     password!: string;
    
//     @Field()
//     contact!: number;
// }

// @InputType()
// class LoginInput {
//     @Field()
//     username!: string;

//     @Field()
//     password!: string;

//     @Field()
//     email!: string;
// }

// @InputType()
// class VerifyCodeInput {
//     @Field()
//     email!: string;
    
//     @Field()
//     code!: string;
// }

// @ObjectType()
// class UserResponse {
//     @Field(() => [FieldError], { nullable: true })
//     errors?: FieldError[];

//     @Field(() => User, { nullable: true })
//     user?: User;

//     @Field(() => LocationData, { nullable: true })
//     location?: LocationData;
// }

// // Helper function to get client IP
// function getClientIp(req: any): string {
//     const forwarded = req.headers['x-forwarded-for'];
//     if (typeof forwarded === 'string') {
//         return forwarded.split(',')[0].trim();
//     }
//     return req.socket.remoteAddress || '';
// }

// // Helper function to fetch location data
// async function getLocationFromIp(ip: string): Promise<LocationData> {
//     if (ip === '::1' || ip === '127.0.0.1') {
//         return {
//             ip,
//             country: 'Localhost',
//             city: 'Development'
//         };
//     }

//     try {
//         // Using ip-api.com
//         const response = await fetch(`https://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,lat,lon,query`);
//         const data = await response.json();

//         if (data.status !== 'success') {
//             throw new Error(data.message || 'Failed to fetch location');
//         }

//         return {
//             ip: data.query,
//             country: data.country,
//             city: data.city,
//             region: data.regionName,
//             latitude: data.lat,
//             longitude: data.lon
//         };
//     } catch (error) {
//         console.error('Location fetch error:', error);
//         return {
//             ip,
//             country: 'Unknown',
//             city: 'Unknown'
//         };
//     }
// }

// @Resolver()
// export class UserResolver {
//     @Query(() => User, { nullable: true })
//     async me(@Ctx() { req, em }: MyContext) {
//         if (!req.session.userId) {
//             return null;
//         }
//         return await em.findOne(User, { id: req.session.userId as string });
//     }

//     @Mutation(() => UserResponse)
//     async register(
//         @Arg("options") options: RegisterInput,
//         @Ctx() { em }: MyContext
//     ): Promise<UserResponse> {
//         const existingSeller = await em.findOne(Company, { email: options.email });
//         const existingUser = await em.findOne(User, { username: options.username });
        
//         if (existingUser) {
//             return { errors: [{ field: "username", message: "Username already taken" }] };
//         }
//         if (existingSeller) {
//             return { errors: [{ field: "email", message: "Email is already registered as a seller." }] };
//         }
//         if (options.username.length <= 3) {
//             return { errors: [{ field: "username", message: "Username is too short" }] };
//         }
//         if (options.password.length <= 5) {
//             return { errors: [{ field: "password", message: "Password is too short" }] };
//         }

//         const hashedPassword = await argon2.hash(options.password);
//         const user = em.create(User, {  
//             username: options.username,
//             password: hashedPassword,
//             contact: options.contact,
//             email: options.email,
//             isEmailVerified: false,
//             isPhoneVerified: false,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         });
//         await em.persistAndFlush(user);

//         const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
//         await redis.set(`emailCode:${user.email}`, emailCode, "EX", 600);

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: "Verify Your Email",
//             text: `Your verification code is: ${emailCode}`,
//         });

//         return { user };
//     }

//     @Mutation(() => UserResponse)
//     async verifyCode(
//         @Arg("input") input: VerifyCodeInput,
//         @Ctx() { em }: MyContext
//     ): Promise<UserResponse> {
//         const user = await em.findOne(User, { email: input.email });

//         if (!user) {
//             return { errors: [{ field: "email", message: "User not found" }] };
//         }

//         const storedEmailCode = await redis.get(`emailCode:${input.email}`);

//         if (!storedEmailCode || input.code !== storedEmailCode) {
//             return { errors: [{ field: "code", message: "Invalid or expired verification code" }] };
//         }

//         user.isEmailVerified = true;
//         await em.persistAndFlush(user);

//         await redis.del(`emailCode:${input.email}`);

//         return { user };
//     }

//     @Mutation(() => UserResponse)
//     async login(
//         @Arg("options") options: LoginInput,
//         @Ctx() { em, req, res }: MyContext
//     ): Promise<UserResponse> {
//         const user = await em.findOne(User, { username: options.username });

//         if (!user) {
//             return { errors: [{ field: "username", message: "Username doesn't exist" }] };
//         }

//         if (user.email !== options.email) {
//             return { errors: [{ field: "email", message: "Invalid Email" }] };
//         }

//         if (!user.isEmailVerified) {
//             return { errors: [{ field: "verification", message: "User not verified" }] };
//         }

//         const valid = await argon2.verify(user.password, options.password);
//         if (!valid) {
//             return { errors: [{ field: "password", message: "Incorrect password" }] };
//         }

//         // Get client IP and location
//         const ip = getClientIp(req);
//         const location = await getLocationFromIp(ip);

//         // Set location cookie
//         res.cookie("user_location", JSON.stringify(location), {
//             httpOnly: false,
//             sameSite: "lax",
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//         });

//         // Save session
//         req.session.userId = user.id;

//         return { 
//             user,
//             location 
//         };
//     }

//     @Query(() => [User])
//     async users(@Ctx() { em }: MyContext): Promise<User[]> {
//         return em.find(User, {});
//     }

//     @Mutation(() => Boolean)
//     logout(@Ctx() { req, res }: MyContext) {
//         return new Promise((resolve) =>
//             req.session.destroy((err) => {
//                 res.clearCookie(COOKIE_NAME);
//                 res.clearCookie("user_location");
//                 if (err) {
//                     console.log(err);
//                     resolve(false);
//                     return;
//                 }
//                 resolve(true);
//             })
//         );
//     }
// }