import "dotenv/config";

export const DB_USER = process.env.DB_USER as string;
export const DB_PASS = process.env.DB_PASS as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
