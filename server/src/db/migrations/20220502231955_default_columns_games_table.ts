import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("games", (table) => {
    table.specificType("p1_prev_guesses", "text ARRAY").defaultTo("{}").alter();
    table
      .specificType("p1_current_guess", "text ARRAY")
      .defaultTo("{}")
      .alter();
    table.integer("p1_current_row").unsigned().defaultTo(0).alter();
    table.boolean("p1_game_won").defaultTo(false).alter();
    table.specificType("p2_prev_guesses", "text ARRAY").defaultTo("{}").alter();
    table
      .specificType("p2_current_guess", "text ARRAY")
      .defaultTo("{}")
      .alter();
    table.integer("p2_current_row").unsigned().defaultTo(0).alter();
    table.boolean("p2_game_won").defaultTo(false).alter();
    table.integer("p2_id").notNullable().defaultTo(-1).alter();
  });
}

export async function down(): Promise<void> {}
