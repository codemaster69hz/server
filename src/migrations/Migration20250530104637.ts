import { Migration } from '@mikro-orm/migrations';

export class Migration20250530104637 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "order" drop column "shipping_address", drop column "billing_address";');

    this.addSql('alter table "order" add column "shipping_address_id" uuid not null, add column "billing_address_id" uuid not null;');
    this.addSql('alter table "order" add constraint "order_shipping_address_id_foreign" foreign key ("shipping_address_id") references "user_address" ("id") on update cascade;');
    this.addSql('alter table "order" add constraint "order_billing_address_id_foreign" foreign key ("billing_address_id") references "user_address" ("id") on update cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "order" drop constraint "order_shipping_address_id_foreign";');
    this.addSql('alter table "order" drop constraint "order_billing_address_id_foreign";');

    this.addSql('alter table "order" drop column "shipping_address_id", drop column "billing_address_id";');

    this.addSql('alter table "order" add column "shipping_address" varchar(255) not null, add column "billing_address" varchar(255) not null;');
  }

}
