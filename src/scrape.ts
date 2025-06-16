#!/usr/bin/env node

import fs from "fs";
import * as cheerio from "cheerio";

interface BarragePart {
  weapon_id: number;
  bullet_id: number;
  damage: number;
  bullet_type: string | null;
  coeff: number | null;
  scaling: number | null;
  scaling_stat: string | null;
  count: number;
  notes: string[];
  proc_percent: number | null;
  buff_id: number | null;
  light_dmg: number;
  med_dmg: number;
  heavy_dmg: number;
  targetting: number;
}

interface BarrageVariant {
  name: string;
  parts: BarragePart[];
}

interface RowData {
  [key: string]: string | null;
}

type BarrageOutput = Record<number, BarrageVariant[]>;

function detectTargetting(notes: string): number {
  const n = notes.toLowerCase();
  if (/(?:priority target|target priority)/.test(n)) {
    return 1;
  }
  if (/(?:random target|target random)/.test(n)) {
    return 2;
  }
  if (/(?:nearest target|target nearest)/.test(n)) {
    return 3;
  }
  if (n.includes("target")) {
    return 4;
  }
  return 0;
}

function normalize(col: string): string {
  // lower-case, strip non-alphanumerics
  return col.replace(/\W+/g, "").toLowerCase();
}

// Load and parse the saved HTML dump
const html: string = fs.readFileSync("test.html", "utf-8");
const $: cheerio.CheerioAPI = cheerio.load(html);

// Identify only the barrage tables by header presence
const required: Set<string> = new Set([
  "skillid",
  "weaponid",
  "bulletid",
  "damage",
  "notes",
]);
const tables: cheerio.Element[] = [];

$("#mw-content-text .wikitable").each((_, tbl: cheerio.Element) => {
  const hdrs: string[] = $(tbl)
    .find("tr")
    .first()
    .find("th")
    .map((_, th: cheerio.Element) => $(th).text().trim())
    .get();

  const normalizedHdrs: Set<string> = new Set(hdrs.map(normalize));
  if ([...required].every((req: string) => normalizedHdrs.has(req))) {
    tables.push(tbl);
  }
});

const out: BarrageOutput = {};

for (const tbl of tables) {
  // Build normalized column keys
  const origCols: string[] = $(tbl)
    .find("tr")
    .first()
    .find("th")
    .map((_, th: cheerio.Element) => $(th).text().trim())
    .get();

  const colKeys: string[] = origCols.map(normalize);
  const lastSeen: Record<string, string | null> = Object.fromEntries(
    colKeys.map((key: string) => [key, null])
  );

  // Track grouping state per skill
  const lastName: Record<number, string> = {};
  const lastBarrage: Record<number, BarrageVariant> = {};

  $(tbl)
    .find("tr")
    .slice(1)
    .each((_, row: cheerio.Element) => {
      const cells: cheerio.Cheerio<cheerio.Element> = $(row).find("td");
      if (
        cells.length === 0 ||
        cells.toArray().every((td: cheerio.Element) => !$(td).text().trim())
      ) {
        return;
      }

      // Extract text or null, then pad to header length
      let texts: (string | null)[] = cells
        .map((_, td: cheerio.Element) => $(td).text().trim() || null)
        .get();
      if (texts.length < colKeys.length) {
        texts = texts.concat(Array(colKeys.length - texts.length).fill(null));
      }

      // Inherit blank cells
      const rowdict: RowData = {};
      for (let i = 0; i < colKeys.length; i++) {
        const key: string = colKeys[i];
        const val: string | null = texts[i];
        if (val === null) {
          rowdict[key] = lastSeen[key];
        } else {
          rowdict[key] = val;
          lastSeen[key] = val;
        }
      }

      // Guard: need numeric skillid & bulletid
      const sidRaw: string = rowdict.skillid || "";
      const bulletRaw: string = rowdict.bulletid || "";
      if (!/^\d+$/.test(sidRaw) || !/^\d+$/.test(bulletRaw)) {
        return;
      }

      const sid: number = parseInt(sidRaw);
      const sname: string = rowdict.skillname || "";

      // New barrage variant when skill name changes
      if (!(sid in lastName) || lastName[sid] !== sname) {
        const b: BarrageVariant = { name: sname, parts: [] };
        if (!(sid in out)) out[sid] = [];
        out[sid].push(b);
        lastName[sid] = sname;
        lastBarrage[sid] = b;
      }

      // Conversion helpers
      const toInt = (v: string | null): number | null =>
        v && /^\d+$/.test(String(v)) ? parseInt(v) : null;

      const toFloat = (v: string | null): number | null => {
        if (!v) return null;
        try {
          const parsed = parseFloat(v);
          return isNaN(parsed) ? null : parsed;
        } catch {
          return null;
        }
      };

      // Build part dict
      const part: BarragePart = {
        weapon_id: parseInt(rowdict.weaponid!),
        bullet_id: parseInt(rowdict.bulletid!),
        damage: parseInt(rowdict.damage!),
        bullet_type: rowdict.bullettype || null,
        coeff: toFloat(rowdict.coeff),
        scaling: toFloat(rowdict.scaling),
        scaling_stat: rowdict.scalingstat || null,
        count: toInt(rowdict.bulletcount) || 0,
        notes: (rowdict.notes || "")
          .split(",")
          .map((n: string) => n.trim())
          .filter((n: string) => n),
        proc_percent: toFloat(rowdict.proc),
        buff_id: toInt(rowdict.buffid),
        light_dmg: toFloat(rowdict.lightdmg) || 0,
        med_dmg: toFloat(rowdict.meddmg) || 0,
        heavy_dmg: toFloat(rowdict.heavydmg) || 0,
        targetting: detectTargetting(rowdict.notes || ""),
      };

      lastBarrage[sid].parts.push(part);
    });
}

// Write out to barrages3.json
fs.writeFileSync("barrages3.json", JSON.stringify(out, null, 2), "utf-8");

console.log("Written", Object.keys(out).length, "skills to barrages3.json");
