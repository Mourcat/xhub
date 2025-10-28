
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'postgres',
  user: 'postgres',
  password: '1234',
});

export { pool };
export const db = drizzle(pool, { schema });
