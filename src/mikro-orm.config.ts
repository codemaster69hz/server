require('dotenv').config();
import { Post } from './entities/Post';
import { User } from './entities/User';
import { __prod__ } from './constants';
import { defineConfig, UnderscoreNamingStrategy } from '@mikro-orm/postgresql'; 
import path from 'path';
import { Company } from './entities/Company';
import { ProductVariation } from './entities/ProductVar';
import { Category } from './entities/Category';
import { Product } from './entities/Products';
import { Admin } from "./entities/Admin";
import { CartItem } from './entities/CartItem';
import { Review } from './entities/Reviews';
import { UserAddress } from './entities/UserAddress';
import { Order } from './entities/Order';
import { BoughtProduct } from './entities/BoughtProduct';
import { WishlistItem } from './entities/WishlistItem';

export default defineConfig({
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',  
  },
  entities: [Post, User, Company, Product, BoughtProduct, WishlistItem, ProductVariation, UserAddress, Order, Category, Admin, CartItem, Review],
  allowGlobalContext: true,
  clientUrl: process.env.PSQL_URL,
  namingStrategy: UnderscoreNamingStrategy,
  debug: !__prod__,
}as Parameters<typeof defineConfig>[0]);