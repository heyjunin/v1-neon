# V1 CLI

CLI development tools for the V1 project, inspired by Laravel's Artisan commands.

## Installation

The CLI is automatically available when you install the project dependencies:

```bash
bun install
```

## Usage

### Make Seeder Command

Create a new seeder file with different templates:

```bash
# Basic seeder
bun run make:seeder users

# Seeder with table reference
bun run make:seeder products --table=products

# Seeder with faker template
bun run make:seeder products --table=products --template=faker

# Advanced seeder template
bun run make:seeder categories --template=advanced

# Force overwrite existing file
bun run make:seeder users --force
```

### Available Templates

- **basic**: Simple seeder with manual data entry
- **faker**: Seeder with faker.js integration for fake data
- **advanced**: Complex seeder with multiple scenarios and relationships

### Examples

```bash
# Create a basic users seeder
bun run make:seeder users

# Create a products seeder with faker data
bun run make:seeder products --table=products --template=faker

# Create an advanced categories seeder
bun run make:seeder categories --template=advanced
```

## Development

### Building the CLI

```bash
bun run cli:build
```

### Development Mode

```bash
bun run cli:dev
```

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Export the command function
3. Add it to `src/commands/index.ts`
4. Register it in `src/index.ts`

### Template System

Templates use a simple placeholder system:

- `{{seederName}}`: kebab-case name
- `{{SeederName}}`: PascalCase name
- `{{tableName}}`: table name (if provided)
- `{{TableName}}`: PascalCase table name

## Architecture

```
packages/cli/
├── src/
│   ├── commands/          # CLI commands
│   ├── templates/         # Code templates
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── index.ts          # Main entry point
├── bin/
│   └── v1-cli.js         # Executable
└── package.json
```

## Contributing

When adding new commands:

1. Follow the existing command structure
2. Add proper TypeScript types
3. Include error handling
4. Add help text
5. Update this README
