import { Request, Response } from "express";
import { Knex } from "knex";

type Context = {
  req: Request & { session: { userId?: number } };
  res: Response;
  db: Knex<any, unknown[]>;
};

export default Context;
