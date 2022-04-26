import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("games", (table) => {
    table.increments("id");
    table.string("room_id").notNullable();
    table.integer("p1_id").notNullable();
    table.integer("p2_id").notNullable();
    table.specificType("p1_prev_guesses", "text ARRAY");
    table.specificType("p1_current_guess", "text ARRAY");
    table.integer("p1_current_row").unsigned();
    table.boolean("p1_game_won");
    table.specificType("p2_prev_guesses", "text ARRAY");
    table.specificType("p2_current_guess", "text ARRAY");
    table.integer("p2_current_row").unsigned();
    table.boolean("p2_game_won");
    table.timestamps(true, true);
    table.foreign("p1_id").references("users.id");
    table.foreign("p2_id").references("users.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("games");
}
