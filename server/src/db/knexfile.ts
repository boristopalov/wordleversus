import type { Knex } from "knex";
import { DB_USER, DB_PASS } from "../config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      database: "wordle",
      user: DB_USER,
      password: DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations/dev",
    },
  },

  testing: {
    client: "pg",
    connection: {
      database: "wordle_test",
      user: DB_USER,
      password: DB_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations/test",
    },
  },
};

module.exports = config;
