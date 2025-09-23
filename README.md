# al-barrage-datamine

A data mining tool for extracting and parsing barrage information from Azur Lane game data. Primarily designed for Azur Lane Wiki usage, this tool processes ship, equipment, and augment data to create structured barrage datasets.

## Features

- **Ship Barrage Parsing**: Extracts barrage data from ship skills, including base skills, retrofit upgrades, fate simulation, and augment enhancements
- **Equipment Integration**: Processes equipment skills and their associated barrages
- **Augment Support**: Handles augment skills and skill upgrades
- **Structured Output**: Generates JSON output with skill metadata and barrage configurations
- **Type Safety**: Full TypeScript support with strict type checking

## Installation

### Prerequisites

- [Bun](https://bun.sh/) runtime (recommended)
- Git

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/al-barrage-datamine.git
cd al-barrage-datamine
```

2. Install dependencies:

```bash
bun install
```

3. Initialize submodules (Azur Lane data):

```bash
git submodule update --init --recursive
```

4. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all variables as necessary.

## Usage

### Basic Usage

Run the main parsing script:

```bash
bun run main
```

This will generate `output/data.json` with parsed barrage data.

### Custom Output Location

Specify a custom output file:

```bash
bun main.ts /path/to/output.json
```

### Direct Execution

You can also run the script directly:

```bash
bun main.ts
```

## Development

### Project Structure

```
├── AzurLaneData/          # Game data submodule
│   ├── data/             # JSON data files
│   └── types/            # TypeScript type definitions
├── src/                  # Source code
│   ├── barrageParse.ts   # Main parsing logic
│   └── types.ts          # Local type definitions
├── test/                 # Test files
│   └── barrageParse.test.ts
├── main.ts               # Main entry point
├── package.json
├── tsconfig.json
├── biome.jsonc           # Biome configuration
├── lefthook.yml          # Git hooks configuration
├── bun.lock
├── .gitignore
├── .env.example          # Environment variables template
├── .gitmodules           # Git submodules
├── AGENTS.md             # Agent guidelines
└── README.md
```

### Testing

Run the test suite:

```bash
bun test
```

Run a specific test:

```bash
bun test --testNamePattern="parses Warspite barrages correctly"
```

### Code Style

The project uses Biome for code formatting and linting. Configuration is in `biome.jsonc`.

## Output Format

The generated JSON contains barrage data organized by ship/equipment name:

```json
{
  "Warspite": [
    {
      "skillId": 12345,
      "skillName": "Divine Marksman",
      "skillType": 1,
      "barrageType": "ship",
      "barrage": [...]
    }
  ]
}
```

### Barrage Types

- `ship`: Base ship skills
- `retrofit`: Retrofit upgrade skills
- `fate`: Fate simulation skills
- `augment`: Augment enhancement skills
- `equip`: Equipment skills

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b <branch name>`
3. Make your changes and add tests
4. Run tests: `bun test`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin <branch name>`
7. Submit a pull request

### Development Guidelines

- Follow the code style defined in `AGENTS.md`
- Add tests for new functionality
- Update documentation as needed
- Use TypeScript strict mode features

## License

See [LICENSE.md](AzurLaneData/LICENSE.md) in the Azur Lane data submodule.

All code in this project is MIT Licensed, in the same manner as [LICENSE.md](AzurLaneData/LICENSE.md)

Azur Lane and all related copyrights/assets used in this repository and its files are the property of Manjuu, Xiamen Yongshi and Yostar Inc. respectively.

All data provided by the JSON files are a derivative of some of the game assets of Azur Lane. The three entities named above retain the right to request the removal of this project at any time.

## Related Projects

- [Azur Lane Wiki](https://azurlane.koumakan.jp/wiki)
- [Azur Lane Data Repository](https://github.com/MrLar/AzurLaneData)
