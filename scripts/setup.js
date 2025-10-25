#!/usr/bin/env node

/**
 * Setup script for the web project template
 * Guides users through initial configuration
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { createInterface } from 'readline';

const execAsync = promisify(exec);

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => readline.question(query, resolve));

async function main() {
  console.log('🚀 Welcome to Web Project Template Setup!\n');

  // Check if .env exists
  if (existsSync('.env')) {
    const overwrite = await question(
      '.env file already exists. Overwrite? (y/N): '
    );
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Skipping .env setup.');
      readline.close();
      return;
    }
  }

  console.log('\n📝 Configuration\n');

  // Database URL
  const dbUrl = await question(
    'Database URL [postgresql://postgres:postgres@localhost:54322/postgres]: '
  );
  const databaseUrl =
    dbUrl.trim() || 'postgresql://postgres:postgres@localhost:54322/postgres';

  // JWT Secret
  console.log('\n🔐 Generating JWT secret...');
  const jwtSecret =
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);

  // API Port
  const apiPort = await question('API Port [3001]: ');
  const apiPortValue = apiPort.trim() || '3001';

  // Create .env file
  const envContent = `# Database
DATABASE_URL=${databaseUrl}

# Supabase (optional - only if using Supabase)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# API
API_PORT=${apiPortValue}
API_HOST=localhost

# Web
NEXT_PUBLIC_API_URL=http://localhost:${apiPortValue}

# JWT Secret (auto-generated)
JWT_SECRET=${jwtSecret}

# Node Environment
NODE_ENV=development
`;

  await writeFile('.env', envContent);
  console.log('\n✅ Created .env file\n');

  // Install dependencies
  const install = await question('Install dependencies with pnpm? (Y/n): ');
  if (install.toLowerCase() !== 'n') {
    console.log('\n📦 Installing dependencies...\n');
    try {
      await execAsync('pnpm install', { stdio: 'inherit' });
      console.log('\n✅ Dependencies installed\n');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
    }
  }

  // Run migrations
  const migrate = await question('Run database migrations? (Y/n): ');
  if (migrate.toLowerCase() !== 'n') {
    console.log('\n🗄️  Running database migrations...\n');
    try {
      await execAsync('pnpm db:generate', { stdio: 'inherit' });
      await execAsync('pnpm db:migrate', { stdio: 'inherit' });
      console.log('\n✅ Migrations completed\n');
    } catch (error) {
      console.error(
        '❌ Failed to run migrations:',
        error.message,
        '\nYou can run them manually later with: pnpm db:migrate'
      );
    }
  }

  console.log('\n✨ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Start development: pnpm dev');
  console.log('  2. Visit http://localhost:3000');
  console.log('  3. Read docs/GETTING_STARTED.md\n');

  readline.close();
}

main().catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
