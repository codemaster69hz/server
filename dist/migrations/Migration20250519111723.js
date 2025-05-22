"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250519111723 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250519111723 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "product" alter column "weight" type text using ("weight"::text);');
        this.addSql('alter table "product" alter column "weight" set not null;');
        this.addSql('alter table "product_variation" alter column "weight" type varchar(255) using ("weight"::varchar(255));');
    }
    async down() {
        this.addSql('alter table "product" alter column "weight" type int using ("weight"::int);');
        this.addSql('alter table "product" alter column "weight" drop not null;');
        this.addSql('alter table "product_variation" alter column "weight" type int using ("weight"::int);');
    }
}
exports.Migration20250519111723 = Migration20250519111723;
//# sourceMappingURL=Migration20250519111723.js.map