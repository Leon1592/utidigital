import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import db from "./db";

export const auth = betterAuth({
  database: kyselyAdapter(db),
});
