# Agent Guidelines for al-barrage-datamine

## Build/Test Commands
- **Run main script**: `bun run main` or `bun main.ts`
- **Run all tests**: `bun test`
- **Run single test**: `bun test --testNamePattern="test name"` or `bun test test/file.test.ts`
- **Lint and format**: `bun run check` (Biome handles linting, formatting, and type checking)

## Code Style Guidelines

### Runtime & Tooling
- Use Bun runtime exclusively (not Node.js)
- Use `bun test` for testing with `import { test, expect } from "bun:test"`
- Use `bun run lint` for linting and formatting with Biome
- Use `Bun.file()` for file operations, `Bun.write()` for writing files

### TypeScript Configuration
- Strict mode enabled with additional flags: `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `noImplicitOverride`
- Path aliases: `@/data/*` → `./AzurLaneData/*`, `@/src/*` → `./src/*`
- Target: ESNext, Module: Preserve (bundler mode)

### Imports & Types
- Use `import type` for type-only imports
- Group imports: built-ins, then third-party, then local with path aliases
- Prefer explicit types over inferred types for function parameters

### Formatting (Biome)
- No semicolons
- Double quotes
- Trailing commas: all
- 2 spaces indentation
- Unix line endings (LF)

### Naming Conventions
- Functions/variables: camelCase
- Types/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case.ts

### Error Handling
- Use async/await with try-catch blocks
- Type errors as `any` in catch blocks when needed
- Console.error for error logging

### Code Patterns
- Prefer functional programming over classes
- Use Map/Set for collections when appropriate
- Helper functions for complex logic
- Early returns for cleaner code flow
- No implementation comments (self-documenting code)

### Testing
- Use `bun:test` whenever possible.
- Use descriptive test names
- Test specific functionality, not implementation details
- Use `expect().toBeDefined()`, `toBeGreaterThan()`, etc.
- Mock external dependencies when needed

# Bun Information (DO NOT EDIT IT)

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.
