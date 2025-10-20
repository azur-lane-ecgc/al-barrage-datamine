# al-barrage-datamine

TypeScript tool for processing Azur Lane barrage data into JSON and Lua formats for the Azur Lane Wiki.

## Installation

```bash
git clone --recursive https://github.com/your-repo/al-barrage-datamine.git
cd al-barrage-datamine
bun install
```

## Usage

```bash
bun run start    # Run full pipeline: barrage processing + wiki
bun run barrage  # Process barrage data and run linting
bun run wiki     # Run wiki functionality
```

### Output Files

Generated in `output/` directory:
- `barrages.json` - Ship barrages
- `barrages2.json` - Equipment and augment barrages  
- `data.lua` - Lua module version of barrages.json
- `data2.lua` - Lua module version of barrages2.json

### Project Structure

```
src/
├── barrage/          # Barrage parsing functionality
│   ├── index.ts      # Main barrage processing script
│   ├── types/        # Type definitions
│   └── utils/        # Utility functions
└── wiki/             # Wiki functionality
    └── index.ts      # Wiki operations
```

## Development

```bash
bun run lint   # Format and lint code
bun test       # Run tests
bun run start  # Process data and lint (full pipeline)
```

## Credits

- Uses data from [AzurLaneData](https://github.com/MrLar/AzurLaneData)
- Based on work by Riceist ([User:Riceist/BarrageDatamine](https://azurlane.koumakan.jp/wiki/User:Riceist/BarrageDatamine))
- Azur Lane © Manjuu, Xiamen Yongshi, and Yostar Inc.

## License

This project is licensed under the [MIT License](LICENSE.md).

### Third-Party Content

This project makes use of third-party software and assets, which are licensed separately under their own terms. These include, but are not limited to:

- [AzurLaneData repository](https://github.com/MrLar/AzurLaneData) (MIT License)
- Riceist's barrage datamine work ([User:Riceist/BarrageDatamine](https://azurlane.koumakan.jp/wiki/User:Riceist/BarrageDatamine))
- NPM package dependencies (various licenses)
- Azur Lane game assets, which are the property of Manjuu Co., Ltd., YongShi Co., Ltd., and Yostar, Inc., among others.

All third-party licenses remain in full effect and apply only to their respective components.  
This project is not affiliated with Manjuu Co., Ltd., YongShi Co., Ltd., and Yostar, Inc., who reserve the right to shut down this project at any time.

## Star History

<a href="https://www.star-history.com/#azur-lane-ecgc/al-barrage-datamine&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=azur-lane-ecgc/al-barrage-datamine&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=azur-lane-ecgc/al-barrage-datamine&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=azur-lane-ecgc/al-barrage-datamine&type=Date" />
  </picture>
</a>