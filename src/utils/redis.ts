import Redis from "ioredis";
require("dotenv").config();

export const redis = new Redis("redis://default:HKoVGQNMnKosvhQfFyWjjeXwjcbCQUNf@turntable.proxy.rlwy.net:58559" as string);
