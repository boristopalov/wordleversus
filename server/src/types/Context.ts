import { Request, Response } from "express";

type Context = {
  req: Request;
  res: Response;
};

export default Context;
