import { knex } from "knex";

declare module "knex/types/tables" {
  interface User {
    id: number;
    username: string;
    password: string;
    created_at: string;
    updated_at: string;
  }

  interface Tables {
    users: User;
  }
}
