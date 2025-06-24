require("dotenv").config();
export const __prod__ = process.env.NODE_ENV === 'production';
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const COOKIE_NAME = process.env.COOKIE_NAME as string;