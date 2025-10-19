# al-barrage-datamine

A TypeScript-based tool for processing and datamining Azur Lane barrage data. This project generates structured JSON and Lua modules for use on the Azur Lane Wiki and other applications.

## Overview

This tool processes barrage data from the [AzurLaneData](https://github.com/MrLar/AzurLaneData) repository to create formatted output files containing ship barrages and equipment/augment barrages. It replaced the original Python implementation with a modern TypeScript codebase that works directly with structured JSON data instead of HTML parsing.

## Features

- **Ship Barrage Processing**: Extracts and formats barrage data for all ships
- **Equipment & Augment Barrages**: Processes barrages for equipment and augment items
- **Multiple Output Formats**: Generates both JSON and Lua module formats
- **Type Safety**: Full TypeScript support with comprehensive type definitions

- **Testing Suite**: Includes testing utilities for validation

## Requirements

- [Bun](https://bun.sh/) runtime (latest version)
- Git (for submodule management)

## Installation

1. Clone the repository with submodules:
```bash
git clone --recursive https://github.com/your-repo/al-barrage-datamine.git
cd al-barrage-datamine
```

2. Install dependencies:
```bash
bun install
```

## Usage

### Basic Processing

Run the main processing script:

```bash
bun run index.ts
```

Or use the npm script:

```bash
bun run start
```

This will:
1. Update the AzurLaneData submodule to the latest version
2. Process ship barrages from `ships.json` and `barrages.json`
3. Process equipment and augment barrages
4. Generate output files in the `output/` directory

### Output Files

The script generates the following files in the `output/` directory:

- **`barrages.json`** - Ship barrages with associated ship names
- **`barrages2.json`** - Equipment and augment barrages with associated item names
- **`data.lua`** - Lua module version of `barrages.json`
- **`data2.lua`** - Lua module version of `barrages2.json`



## Project Structure

```
al-barrage-datamine/
├── src/
│   ├── types/           # TypeScript type definitions
│   │   ├── barrages.ts  # Barrage data types
│   │   ├── index.ts     # Type exports
│   │   └── redefined.ts # Additional type definitions
│   ├── data.ts          # Data loading utilities
│   ├── jsonParser.ts    # Main JSON processing logic
│   └── luaConverter.ts  # Lua module generation
├── output/              # Generated output files
├── testing/             # Testing utilities and files

├── AzurLaneData/        # Git submodule with game data
├── index.ts             # Main entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── biome.json           # Code formatting and linting config
└── README.md
```

## Architecture

### Core Components

- **`src/types/`** - Comprehensive TypeScript type definitions for all barrage data structures
- **`src/jsonParser.ts`** - Main processing logic that replaces the original Python `barrage.py` and `barrage2.py`
- **`src/luaConverter.ts`** - Converts JSON output to Lua module format for wiki compatibility
- **`index.ts`** - Orchestrates the entire data processing pipeline

### Data Sources

The project uses data from the [AzurLaneData](https://github.com/MrLar/AzurLaneData) repository, which provides:

- `ships.json` - Ship data with barrage references
- `barrages.json` - Raw barrage definitions
- `equipments.json` - Equipment data
- `augments.json` - Augment data

### Key Improvements Over Python Version

- **Type Safety**: Full TypeScript support prevents runtime errors
- **Direct JSON Processing**: No HTML parsing required - works with structured data
- **Modern Runtime**: Uses Bun for faster execution
- **Better Maintainability**: Modular architecture with clear separation of concerns
- **Comprehensive Testing**: Built-in testing utilities

## Development

### Code Quality

The project uses [Biome](https://biomejs.dev/) for code formatting and linting:

```bash
# Format and lint code
bun run lint
```

### Testing

The `testing/` directory contains utilities for validating output:

- `barrage.ts` - Barrage testing logic

- Various test data files (`.json`, `.lua`, `.wikitext`)

### Building

The project uses Bun's native TypeScript support, so no separate build step is required. The `tsconfig.json` is configured for optimal development experience.

## Dependencies

### Runtime Dependencies
- **Bun** - JavaScript runtime and package manager

### Development Dependencies
- **@biomejs/biome** - Code formatting and linting
- **@types/bun** - TypeScript definitions for Bun
- **typescript** - TypeScript compiler

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `bun run start`
5. Submit a pull request

## Credits

- **Original Python Implementation**: Based on the work by Riceist ([User:Riceist/BarrageDatamine](https://azurlane.koumakan.jp/wiki/User:Riceist/BarrageDatamine))
- **Azur Lane Data**: Uses data from [AzurLaneData](https://github.com/MrLar/AzurLaneData) repository
- **Azur Lane**: Game assets and data © Manjuu, Xiamen Yongshi, and Yostar Inc.

## License

This project is licensed under the MIT License. However, when using the generated data, you must credit Manjuu, Yongshi, and Yostar Inc. as required by the AzurLaneData license.

## Related Projects

- [Azur Lane Calculator](https://azurlane.mrlar.dev/calculator)
- [Azur Lane Database](https://azurlane.mrlar.dev/db)
- [Azur Lane Wiki](https://azurlane.koumakan.jp/)