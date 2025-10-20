import { describe, expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createShipBarragesJson } from "@/barrage/utils/jsonParser"
import { convertJsonToLua, jsonToLua } from "@/barrage/utils/luaConverter"

describe("Lua Conversion Tests", () => {
  test("Basic Syntax Validation - Numbers", () => {
    expect(jsonToLua(42)).toBe("42")
    expect(jsonToLua(3.14)).toBe("3.14")
    expect(jsonToLua(-10)).toBe("-10")
    expect(jsonToLua(0)).toBe("0")
  })

  test("Basic Syntax Validation - Strings", () => {
    expect(jsonToLua("hello")).toBe('"hello"')
    expect(jsonToLua("")).toBe('""')
    expect(jsonToLua('test "quote"')).toBe('"test \\"quote\\""')
    expect(jsonToLua("line\nbreak")).toBe('"line\\nbreak"')
    expect(jsonToLua("back\\slash")).toBe('"back\\\\slash"')
  })

  test("Basic Syntax Validation - Booleans", () => {
    expect(jsonToLua(true)).toBe("true")
    expect(jsonToLua(false)).toBe("false")
  })

  test("Basic Syntax Validation - Arrays", () => {
    expect(jsonToLua([])).toBe("{}")
    expect(jsonToLua([1, 2, 3])).toBe("{ 1, 2, 3 }")
    expect(jsonToLua(["a", "b"])).toBe('{ "a", "b" }')
    expect(jsonToLua([true, false])).toBe("{ true, false }")
    expect(jsonToLua([1, "test", true])).toBe('{ 1, "test", true }')
  })

  test("Basic Syntax Validation - Objects", () => {
    expect(jsonToLua({})).toBe("{}")
    expect(jsonToLua({ a: 1 })).toBe("{\n  a = 1\n}")
    expect(jsonToLua({ key: "value" })).toBe('{\n  key = "value"\n}')
    expect(jsonToLua({ flag: true })).toBe("{\n  flag = true\n}")
  })

  test("Data Type Conversion - Arrays to Lua tables", () => {
    const emptyArray: unknown[] = []
    const nonEmptyArray = [1, 2, 3]

    expect(jsonToLua(emptyArray)).toBe("{}")
    expect(jsonToLua(nonEmptyArray)).toBe("{ 1, 2, 3 }")
  })

  test("Data Type Conversion - Objects to Lua tables with proper key formatting", () => {
    const simpleObj = { key: "value" }
    const numericKeyObj = { "123": "numeric" }
    const specialKeyObj = { "special-key": "value" }
    const mixedObj = { a: 1, b: "test", c: true }

    expect(jsonToLua(simpleObj)).toBe('{\n  key = "value"\n}')
    expect(jsonToLua(numericKeyObj)).toBe('{\n  ["123"] = "numeric"\n}')
    expect(jsonToLua(specialKeyObj)).toBe('{\n  ["special-key"] = "value"\n}')
    expect(jsonToLua(mixedObj)).toBe(
      '{\n  a = 1,\n  b = "test",\n  c = true\n}',
    )
  })

  test("Data Type Conversion - Special character escaping in strings", () => {
    const testString = 'Test "quotes" and\nnewlines and\\backslashes'
    const expected = '"Test \\"quotes\\" and\\nnewlines and\\\\backslashes"'
    expect(jsonToLua(testString)).toBe(expected)
  })

  test("Output Format - Wrapped in proper Lua module format", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "lua-test-"))
    const testFile = join(tempDir, "test.lua")

    try {
      const testData = { test: "value" }
      await convertJsonToLua(testData, testFile)

      const content = await Bun.file(testFile).text()
      expect(content).toMatch(/^local p = \{[\s\S]*\}\n\nreturn p\n$/)
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  test("Key Sorting - Numeric keys first, then alphabetical", () => {
    const mixedKeys = {
      "10": "ten",
      "2": "two",
      a: "alpha",
      "1": "one",
      b: "beta",
    }

    const result = jsonToLua(mixedKeys)
    const lines = result.split("\n").filter((line) => line.includes(" = "))

    // Should be ordered: 1, 2, 10, a, b
    expect(lines[0]).toContain('["1"]')
    expect(lines[1]).toContain('["2"]')
    expect(lines[2]).toContain('["10"]')
    expect(lines[3]).toContain("a")
    expect(lines[4]).toContain("b")
  })

  test("Key Sorting - Alphabetical order for string keys", () => {
    const obj = { zebra: 1, apple: 2, banana: 3 }
    const result = jsonToLua(obj)
    const lines = result.split("\n").filter((line) => line.includes(" = "))

    expect(lines[0]).toContain("apple")
    expect(lines[1]).toContain("banana")
    expect(lines[2]).toContain("zebra")
  })

  test("End-to-End Conversion - Actual parsed ship barrage data", () => {
    const shipBarrages = createShipBarragesJson()
    const luaOutput = jsonToLua(shipBarrages)

    // Should be valid Lua table syntax
    expect(luaOutput).toMatch(/^\{[\s\S]*\}$/)

    // Should contain skill IDs as keys
    expect(luaOutput).toMatch(/\["\d+"\] = \{/)

    // Should contain barrage structures
    expect(luaOutput).toMatch(/barrages = \{/)
    expect(luaOutput).toMatch(/ships = \{/)
  })

  test("End-to-End Conversion - Complex nested structure", () => {
    const complexData = {
      skillId: "12345",
      barrages: [
        {
          name: "Test Barrage\n(Extra)",
          parts: [
            {
              type: "weapon",
              damage: 100,
              coefficient: 1.5,
              count: 5,
              range: [50, 100],
              armor_mod: [1, 0.8, 0.6],
              ammo: 1,
              is_critical: false,
              shrapnel: false,
              ignore_shield: false,
              aim_type: 1,
              stat: "firepower",
              ratio: 1.0,
              angle: 0,
              notes: ["test", "notes"],
              targeting: null,
              centered: true,
              weapon_type: 1,
              bullet_type: 1,
              bullet_id: 1001,
              weapon_id: 2001,
            },
          ],
        },
      ],
      ships: ["Test Ship", "Another Ship"],
    }

    const luaOutput = jsonToLua(complexData)

    // Should handle all data types correctly
    expect(luaOutput).toContain('"12345"')
    expect(luaOutput).toContain('"Test Barrage\\n(Extra)"')
    expect(luaOutput).toContain("damage = 100")
    expect(luaOutput).toContain("coefficient = 1.5")
    expect(luaOutput).toContain("range = { 50, 100 }")
    expect(luaOutput).toContain("armor_mod = { 1, 0.8, 0.6 }")
    expect(luaOutput).toContain("is_critical = false")
    expect(luaOutput).toContain("targeting = nil")
    expect(luaOutput).toContain("centered = true")
    expect(luaOutput).toContain('notes = { "test", "notes" }')
    expect(luaOutput).toContain('ships = { "Test Ship", "Another Ship" }')
  })

  test("Edge Cases - Null and undefined values", () => {
    expect(jsonToLua(null)).toBe("nil")
    expect(jsonToLua(undefined)).toBe("nil")
  })

  test("Edge Cases - Empty arrays and objects", () => {
    expect(jsonToLua([])).toBe("{}")
    expect(jsonToLua({})).toBe("{}")
  })

  test("Edge Cases - Deeply nested structures", () => {
    const nested = {
      level1: {
        level2: {
          level3: {
            data: [1, 2, 3],
            flag: true,
          },
        },
      },
    }

    const result = jsonToLua(nested)
    expect(result).toContain("level1 = {")
    expect(result).toContain("level2 = {")
    expect(result).toContain("level3 = {")
    expect(result).toContain("data = { 1, 2, 3 }")
    expect(result).toContain("flag = true")
  })

  test("Special Keys - Keys requiring quotes", () => {
    const specialKeys = {
      "123": "numeric",
      "with-dash": "dash",
      "with space": "space",
      "with.dot": "dot",
      normal: "normal",
    }

    const result = jsonToLua(specialKeys)
    expect(result).toContain('["123"]')
    expect(result).toContain('["with-dash"]')
    expect(result).toContain('["with space"]')
    expect(result).toContain('["with.dot"]')
    expect(result).toContain("normal =")
  })
})
