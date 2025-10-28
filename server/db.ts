import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'xhub',
  user: 'postgres',
  password: 'mour',
});

export { pool };
export const db = drizzle(pool, { schema });
