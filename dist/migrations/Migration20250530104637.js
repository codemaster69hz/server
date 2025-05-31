"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250530104637 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250530104637 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "order" drop column "shipping_address", drop column "billing_address";');
        this.addSql('alter table "order" add column "shipping_address_id" uuid not null, add column "billing_address_id" uuid not null;');
        this.addSql('alter table "order" add constraint "order_shipping_address_id_foreign" foreign key ("shipping_address_id") references "user_address" ("id") on update cascade;');
        this.addSql('alter table "order" add constraint "order_billing_address_id_foreign" foreign key ("billing_address_id") references "user_address" ("id") on update cascade;');
    }
    async down() {
        this.addSql('alter table "order" drop constraint "order_shipping_address_id_foreign";');
        this.addSql('alter table "order" drop constraint "order_billing_address_id_foreign";');
        this.addSql('alter table "order" drop column "shipping_address_id", drop column "billing_address_id";');
        this.addSql('alter table "order" add column "shipping_address" varchar(255) not null, add column "billing_address" varchar(255) not null;');
    }
}
exports.Migration20250530104637 = Migration20250530104637;
//# sourceMappingURL=Migration20250530104637.js.map