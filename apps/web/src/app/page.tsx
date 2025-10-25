import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Web Project Template</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A full-stack template with Next.js, Fastify, and TypeScript
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Register
          </Link>
        </div>

        <div className="pt-8 space-y-4 text-left">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ Next.js 16 with App Router</li>
            <li>✓ Fastify 5 backend with TypeScript</li>
            <li>✓ PostgreSQL with Drizzle ORM</li>
            <li>✓ Shared type definitions</li>
            <li>✓ Authentication ready</li>
            <li>✓ Tailwind CSS styling</li>
            <li>✓ Vitest + Playwright testing</li>
            <li>✓ Claude Code optimized</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
