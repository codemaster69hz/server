require('dotenv').config();
import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import 'reflect-metadata';
import session from 'express-session';
import mikroConfig from './mikro-orm.config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { MikroORM } from '@mikro-orm/postgresql';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { CompanyResolver } from './resolvers/company';
import { ProductResolver } from './resolvers/products';
import { ProductVariationResolver } from './resolvers/productvar';
import { CategoryResolver } from './resolvers/category';
import { AdminResolver } from './resolvers/admin';
import { CartResolver } from './resolvers/cartitem';
import { ReviewResolver } from './resolvers/reviews';
import { UserAddressResolver } from './resolvers/useraddress';
import { OrderResolver } from './resolvers/order';
import { BoughtProductResolver } from './resolvers/boughtproduct';
import { WishlistResolver } from './resolvers/wishlist';
import { redis } from "./utils/redis";

const cors = require("cors");
const connectRedis = require('connect-redis');

async function main() {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const sessionSecret = process.env.SESSION_SECRET as string;
  const app = express();
  
  const RedisStore = new connectRedis(session);

  app.use(cors({ origin: "https://1350-115-96-219-74.ngrok-free.app", credentials: true }));
  // app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: 'sess:',
        ttl: 86400,
        disableTouch: true,
      }),
      name: process.env.COOKIE_NAME,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: false,
        // sameSite: __prod__? "none" :'lax',
        sameSite: 'lax',
      },
    }) as unknown as RequestHandler
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ UserResolver, WishlistResolver, ReviewResolver, BoughtProductResolver, OrderResolver, UserAddressResolver, PostResolver, CartResolver ,CategoryResolver , CompanyResolver, ProductResolver, ProductVariationResolver, AdminResolver],
      validate: false,
    }),
  });

  await server.start();

  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ em: orm.em, req, res }),
    })
  );

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
});
