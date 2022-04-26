import { knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: number;
    username: string;
    password: string;
    created_at: string;
    updated_at: string;
  }
  interface Game {
    id: Number;
    room_id: String;
    p1_id: Number;
    p1_prev_guesses: String[];
    p1_current_guess: String[];
    p1_current_row: Number;
    p1_game_won: Boolean;
    p2_id: Number;
    p2_prev_guesses: String[];
    p2_current_guess: String[];
    p2_current_row: Number;
    p2_game_won: Boolean;
    created_at: String;
    updated_at: String;
  }

  interface Tables {
    users: User;
    games: Game;
  }
}
