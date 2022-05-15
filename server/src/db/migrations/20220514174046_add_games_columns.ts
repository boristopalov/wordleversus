import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("games", (table) => {
    table.string("solution").notNullable();
    table.boolean("p1_ready").defaultTo(false);
    table.boolean("p2_ready").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("games", (table) => {
    table.dropColumn("solution");
    table.dropColumn("p1_ready");
    table.dropColumn("p2_ready");
  });
}
