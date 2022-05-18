import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("games", (table) => {
    table.boolean("active").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("games", (table) => {
    table.dropColumn("active");
  });
}
