# al-barrage-datamine

Tools to barrage datamine. Mainly for Azur Lane Wiki usage.

## Requirements

- Python 3.11 or higher
- Node 20 or higher / Bun (any JS runtime that can run TS files works)

## Installation

This pulls information from Riceist's barrage datamine here: [https://azurlane.koumakan.jp/wiki/User:Riceist/BarrageDatamine]

<!-- Windows -->

```bash
python -m venv .venv
.venv/Scripts/activate
python barrage.py
```

<!-- Other -->

```bash
python -m venv .venv
.venv/bin/activate
python barrage.py
```

Then you can run `barrage.ts`. This generates the data and data2 lua modules.

<!-- Bun  -->

```bash
bun run barrage.ts
```

<!-- Node -->

```bash
node barrage.ts
```

Then, copy over the data and data2 modules to their respective wiki pages.
