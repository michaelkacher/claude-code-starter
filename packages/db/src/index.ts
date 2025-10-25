import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get database URL from environment variable
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres';

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export schema and types
export { schema };
export * from './schema';
