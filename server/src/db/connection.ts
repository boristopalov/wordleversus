import knex from "knex";
import { DB_USER, DB_PASS } from "../config";

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: DB_USER,
    password: DB_PASS,
    database: "wordle",
  },
});

export default db;
