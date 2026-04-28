import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from "kysely";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:dbutidigital1234%23@192.168.1.139:5432/dbutidigital",
});

export const db = new Kysely({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => pool,
    createIntrospector: (db) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
});

export default db;