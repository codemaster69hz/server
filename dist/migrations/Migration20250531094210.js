"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250531094210 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250531094210 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "bought_product" ("id" uuid not null, "user_id" uuid not null, "product_id" uuid not null, "bought_at" timestamptz not null, constraint "bought_product_pkey" primary key ("id"));');
        this.addSql('alter table "bought_product" add constraint "bought_product_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
        this.addSql('alter table "bought_product" add constraint "bought_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    }
    async down() {
        this.addSql('drop table if exists "bought_product" cascade;');
    }
}
exports.Migration20250531094210 = Migration20250531094210;
//# sourceMappingURL=Migration20250531094210.js.map