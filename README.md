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
python barrage2.py
```

<!-- Other -->

```bash
python3 -m venv .venv
.venv/bin/activate
python3 barrage.py
python3 barrage2.py
```

Then, copy over the data and data2 modules within the "output" folder to their respective wiki pages.
