
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: 'localhost',
    port: 5433,
    database: 'postgres',
    user: 'postgres',
    password: '1234',
  },
});
