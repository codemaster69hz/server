import { Migration } from '@mikro-orm/migrations';

export class Migration20250609100832 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "admin" ("id" uuid not null, "username" text not null, "email" text not null, "password" text not null, "is_email_verified" boolean not null default false, constraint "admin_pkey" primary key ("id"));');
    this.addSql('alter table "admin" add constraint "admin_username_unique" unique ("username");');
    this.addSql('alter table "admin" add constraint "admin_email_unique" unique ("email");');

    this.addSql('create table "category" ("id" uuid not null, "name" varchar(255) not null, "slug" varchar(255) not null, "parent_category_id" varchar(255) null, "parentCategoryId" uuid null, "created_at" timestamptz not null, constraint "category_pkey" primary key ("id"));');
    this.addSql('alter table "category" add constraint "category_slug_unique" unique ("slug");');

    this.addSql('create table "company" ("id" uuid not null, "username" text not null, "cname" text not null, "contact" bigint not null, "email" text not null, "password" text not null, "location" text not null, "is_email_verified" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "company_pkey" primary key ("id"));');
    this.addSql('alter table "company" add constraint "company_username_unique" unique ("username");');
    this.addSql('alter table "company" add constraint "company_cname_unique" unique ("cname");');
    this.addSql('alter table "company" add constraint "company_contact_unique" unique ("contact");');
    this.addSql('alter table "company" add constraint "company_email_unique" unique ("email");');

    this.addSql('create table "post" ("id" serial primary key, "title" varchar(255) not null);');

    this.addSql('create table "product" ("id" uuid not null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text not null, "price" numeric(10,0) not null, "size" varchar(255) not null, "material" varchar(255) not null, "weight" text not null, "category_id" uuid not null, "subcategory_id" uuid not null, "company_id" uuid not null, "average_rating" int null, "review_count" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_pkey" primary key ("id"));');
    this.addSql('alter table "product" add constraint "product_slug_unique" unique ("slug");');

    this.addSql('create table "product_variation" ("id" uuid not null, "size" varchar(255) not null, "color" varchar(255) not null, "price" numeric(10,0) not null, "product_id" uuid not null, "slug" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "material" varchar(255) not null, "weight" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_variation_pkey" primary key ("id"));');
    this.addSql('alter table "product_variation" add constraint "product_variation_slug_unique" unique ("slug");');

    this.addSql('create table "user" ("id" uuid not null, "username" text not null, "contact" text not null, "email" text not null, "password" text not null, "is_email_verified" boolean not null default false, "is_phone_verified" boolean not null default false, "ip" varchar(255) null, "country" varchar(255) null, "city" varchar(255) null, "region" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_contact_unique" unique ("contact");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "review" ("id" uuid not null, "user_id" uuid not null, "rating_distribution" text[] null, "product_id" uuid not null, "sentiment" varchar(255) not null, "comment" text not null, "rating" int not null, "created_at" timestamptz not null, constraint "review_pkey" primary key ("id"));');

    this.addSql('create table "order" ("id" uuid not null, "user_id" uuid not null, "status" text check ("status" in (\'pending\', \'processing\', \'completed\', \'cancelled\')) not null default \'pending\', "created_at" timestamptz not null, "updated_at" timestamptz not null, "estimated_delivery_date" timestamptz not null, "total" numeric(10,0) not null, constraint "order_pkey" primary key ("id"));');

    this.addSql('create table "order_item" ("id" uuid not null, "product_id" uuid not null, "variation_id" uuid null, "user_id" uuid null, "quantity" int not null, "price" numeric(10,0) not null, "size" varchar(255) null, "order_id" uuid not null, "created_at" timestamptz not null, constraint "order_item_pkey" primary key ("id"));');

    this.addSql('create table "cart" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_pkey" primary key ("id"));');

    this.addSql('create table "cart_item" ("id" uuid not null, "product_id" uuid not null, "variation_id" uuid null, "quantity" int not null, "price" numeric(10,0) not null, "size" varchar(255) null, "cart_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_item_pkey" primary key ("id"));');
    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_product_id_variation_id_unique" unique ("cart_id", "product_id", "variation_id");');

    this.addSql('create table "bought_product" ("id" uuid not null, "user_id" uuid not null, "product_id" uuid not null, "bought_at" timestamptz not null, constraint "bought_product_pkey" primary key ("id"));');

    this.addSql('create table "user_address" ("id" uuid not null, "user_id" uuid not null, "street_address" varchar(255) not null, "street_address2" varchar(255) not null, "country" varchar(255) not null, "state" varchar(255) not null, "city" varchar(255) not null, "zipcode" varchar(255) not null, "is_default_shipping" boolean not null default false, "is_default_billing" boolean not null default false, constraint "user_address_pkey" primary key ("id"));');
    this.addSql('create index "user_address_user_id_index" on "user_address" ("user_id");');

    this.addSql('create table "wishlist" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "wishlist_pkey" primary key ("id"));');

    this.addSql('create table "wishlist_item" ("id" uuid not null, "product_id" uuid not null, "variation_id" uuid null, "price" numeric(10,0) not null, "size" varchar(255) null, "wishlist_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "wishlist_item_pkey" primary key ("id"));');
    this.addSql('alter table "wishlist_item" add constraint "wishlist_item_product_id_variation_id_wishlist_id_unique" unique ("product_id", "variation_id", "wishlist_id");');

    this.addSql('alter table "category" add constraint "category_parentCategoryId_foreign" foreign key ("parentCategoryId") references "category" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_subcategory_id_foreign" foreign key ("subcategory_id") references "category" ("id") on update cascade;');
    this.addSql('alter table "product" add constraint "product_company_id_foreign" foreign key ("company_id") references "company" ("id") on update cascade;');

    this.addSql('alter table "product_variation" add constraint "product_variation_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "review" add constraint "review_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "review" add constraint "review_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "order_item" add constraint "order_item_variation_id_foreign" foreign key ("variation_id") references "product_variation" ("id") on update cascade on delete set null;');
    this.addSql('alter table "order_item" add constraint "order_item_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');

    this.addSql('alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_variation_id_foreign" foreign key ("variation_id") references "product_variation" ("id") on update cascade on delete set null;');
    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');

    this.addSql('alter table "bought_product" add constraint "bought_product_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "bought_product" add constraint "bought_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('alter table "user_address" add constraint "user_address_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "wishlist" add constraint "wishlist_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "wishlist_item" add constraint "wishlist_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "wishlist_item" add constraint "wishlist_item_variation_id_foreign" foreign key ("variation_id") references "product_variation" ("id") on update cascade on delete set null;');
    this.addSql('alter table "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "category" drop constraint "category_parentCategoryId_foreign";');

    this.addSql('alter table "product" drop constraint "product_category_id_foreign";');

    this.addSql('alter table "product" drop constraint "product_subcategory_id_foreign";');

    this.addSql('alter table "product" drop constraint "product_company_id_foreign";');

    this.addSql('alter table "product_variation" drop constraint "product_variation_product_id_foreign";');

    this.addSql('alter table "review" drop constraint "review_product_id_foreign";');

    this.addSql('alter table "order_item" drop constraint "order_item_product_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_product_id_foreign";');

    this.addSql('alter table "bought_product" drop constraint "bought_product_product_id_foreign";');

    this.addSql('alter table "wishlist_item" drop constraint "wishlist_item_product_id_foreign";');

    this.addSql('alter table "order_item" drop constraint "order_item_variation_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_variation_id_foreign";');

    this.addSql('alter table "wishlist_item" drop constraint "wishlist_item_variation_id_foreign";');

    this.addSql('alter table "review" drop constraint "review_user_id_foreign";');

    this.addSql('alter table "order" drop constraint "order_user_id_foreign";');

    this.addSql('alter table "order_item" drop constraint "order_item_user_id_foreign";');

    this.addSql('alter table "cart" drop constraint "cart_user_id_foreign";');

    this.addSql('alter table "bought_product" drop constraint "bought_product_user_id_foreign";');

    this.addSql('alter table "user_address" drop constraint "user_address_user_id_foreign";');

    this.addSql('alter table "wishlist" drop constraint "wishlist_user_id_foreign";');

    this.addSql('alter table "order_item" drop constraint "order_item_order_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_cart_id_foreign";');

    this.addSql('alter table "wishlist_item" drop constraint "wishlist_item_wishlist_id_foreign";');

    this.addSql('drop table if exists "admin" cascade;');

    this.addSql('drop table if exists "category" cascade;');

    this.addSql('drop table if exists "company" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "product_variation" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "review" cascade;');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "order_item" cascade;');

    this.addSql('drop table if exists "cart" cascade;');

    this.addSql('drop table if exists "cart_item" cascade;');

    this.addSql('drop table if exists "bought_product" cascade;');

    this.addSql('drop table if exists "user_address" cascade;');

    this.addSql('drop table if exists "wishlist" cascade;');

    this.addSql('drop table if exists "wishlist_item" cascade;');
  }

}
