# Agent Guidelines for al-barrage-datamine

## Build/Lint/Test Commands
- **Build/Run**: `bun run start` (processes data and runs linting)
- **Lint**: `bun run lint` (Biome formatting and linting)
- **Test**: `bun test` (Bun test runner)

## Important Notes
- **Ignore `_backup/` folder** - contains backup files, not part of active development

## Code Style Guidelines

### Formatting & Linting
- Use Biome for all formatting/linting (`bun run lint`)
- 2-space indentation, LF line endings
- Double quotes for JavaScript/TypeScript
- Semicolons as needed, trailing commas everywhere

### TypeScript
- Strict mode enabled with comprehensive type checking
- Use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `import type` for type-only imports
- **Prefer arrow functions over function declarations** when possible
- Use `const functionName = () => {}` instead of `function functionName()`

### Imports & Modules
- Path aliases: `@/*` for `src/*`, `@/data/*` for `AzurLaneData/data/*`
- Group imports: built-ins, then external packages, then local imports
- Use named imports over default imports where possible

### Naming Conventions
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Files**: kebab-case for utilities, PascalCase for types
- **Constants**: UPPER_SNAKE_CASE

### Error Handling
- Use try-catch blocks for async operations
- Log errors with `console.error()` and exit with `process.exit(1)`
- Validate inputs and handle edge cases explicitly

### Code Organization
- Keep functions focused and under 50 lines
- Use early returns to reduce nesting
- Prefer functional programming patterns (map, filter, reduce)
- Export functions explicitly rather than default exports