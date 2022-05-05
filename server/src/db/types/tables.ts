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
    id: number;
    room_id: string;
    p1_id: number;
    p1_prev_guesses: string[];
    p1_current_guess: string[];
    p1_current_row: number;
    p1_game_won: boolean;
    p2_id: number;
    p2_prev_guesses: string[];
    p2_current_guess: string[];
    p2_current_row: number;
    p2_game_won: boolean;
    created_at: string;
    updated_at: string;
  }

  interface Tables {
    users: User;
    games: Game;
  }
}
