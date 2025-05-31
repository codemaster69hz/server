"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250530093144 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250530093144 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "order" ("id" uuid not null, "user_id" uuid not null, "status" text check ("status" in (\'pending\', \'processing\', \'completed\', \'cancelled\')) not null default \'pending\', "shipping_address" varchar(255) not null, "billing_address" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "total" numeric(10,0) not null, "tracking_number" varchar(255) null, constraint "order_pkey" primary key ("id"));');
        this.addSql('create table "order_item" ("id" uuid not null, "product_id" uuid not null, "variation_id" uuid null, "quantity" int not null, "price" numeric(10,0) not null, "size" varchar(255) null, "order_id" uuid not null, "created_at" timestamptz not null, constraint "order_item_pkey" primary key ("id"));');
        this.addSql('alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
        this.addSql('alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
        this.addSql('alter table "order_item" add constraint "order_item_variation_id_foreign" foreign key ("variation_id") references "product_variation" ("id") on update cascade on delete set null;');
        this.addSql('alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;');
    }
    async down() {
        this.addSql('alter table "order_item" drop constraint "order_item_order_id_foreign";');
        this.addSql('drop table if exists "order" cascade;');
        this.addSql('drop table if exists "order_item" cascade;');
    }
}
exports.Migration20250530093144 = Migration20250530093144;
//# sourceMappingURL=Migration20250530093144.js.map