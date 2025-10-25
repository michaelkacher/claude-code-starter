import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default {
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
  },
} satisfies Config;
