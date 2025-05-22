import { Migration } from '@mikro-orm/migrations';

export class Migration20250519111723 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "product" alter column "weight" type text using ("weight"::text);');
    this.addSql('alter table "product" alter column "weight" set not null;');

    this.addSql('alter table "product_variation" alter column "weight" type varchar(255) using ("weight"::varchar(255));');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "product" alter column "weight" type int using ("weight"::int);');
    this.addSql('alter table "product" alter column "weight" drop not null;');

    this.addSql('alter table "product_variation" alter column "weight" type int using ("weight"::int);');
  }

}
