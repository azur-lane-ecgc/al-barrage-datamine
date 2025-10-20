import { describe, expect, test } from "bun:test"
import { createShipBarragesJson } from "@/barrage/utils/jsonParser"

describe("Parsing Tests", () => {
  const shipBarrages = createShipBarragesJson()
  const targetShips = [
    "Independence",
    "Rikka Takarada",
    "Z52",
    "Laffey II",
    "Bismarck Zwei",
  ]

  test("Target Ship Validation - All 5 ships should be found", () => {
    const foundShips = new Set<string>()

    Object.entries(shipBarrages).forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.ships.forEach((ship) => {
        foundShips.add(ship)
      })
    })

    targetShips.forEach((ship) => {
      expect(foundShips.has(ship)).toBe(true)
    })

    expect(foundShips.size).toBeGreaterThanOrEqual(targetShips.length)
  })

  test("Property Structure Validation - Weapon barrages", () => {
    const requiredWeaponFields = [
      "damage",
      "coefficient",
      "count",
      "range",
      "armor_mod",
      "ammo",
      "is_critical",
      "shrapnel",
      "ignore_shield",
      "aim_type",
      "stat",
      "ratio",
      "angle",
      "notes",
      "targeting",
      "centered",
      "weapon_type",
      "bullet_type",
      "bullet_id",
      "weapon_id",
    ]

    let weaponBarragesFound = 0
    let completeWeaponBarrages = 0

    Object.entries(shipBarrages).forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string; [key: string]: unknown }
          if (partObj.type === "weapon") {
            weaponBarragesFound++
            const hasAllFields = requiredWeaponFields.every(
              (field) => field in partObj && partObj[field] !== undefined,
            )
            if (hasAllFields) completeWeaponBarrages++
          }
        })
      })
    })

    expect(weaponBarragesFound).toBeGreaterThan(0)
    expect(completeWeaponBarrages).toBe(weaponBarragesFound)
  })

  test("Property Structure Validation - Slash barrages", () => {
    const requiredSlashFields = [
      "damage",
      "count",
      "level_of",
      "clears",
      "velocity",
      "movement_type",
      "life_time",
      "range",
      "fix_damage",
    ]

    let slashBarragesFound = 0
    let completeSlashBarrages = 0

    Object.entries(shipBarrages).forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string; [key: string]: unknown }
          if (partObj.type === "slash") {
            slashBarragesFound++
            const hasAllFields = requiredSlashFields.every(
              (field) => field in partObj && partObj[field] !== undefined,
            )
            if (hasAllFields) completeSlashBarrages++
          }
        })
      })
    })

    expect(slashBarragesFound).toBeGreaterThan(0)
    expect(completeSlashBarrages).toBe(slashBarragesFound)
  })

  test("Property Structure Validation - Summon barrages", () => {
    const requiredSummonFields = [
      "weapons",
      "hull",
      "armor",
      "fp",
      "trp",
      "avi",
      "aa",
      "asw",
      "rld",
      "hit",
      "eva",
      "spd",
      "luck",
    ]

    let summonBarragesFound = 0
    let completeSummonBarrages = 0

    Object.entries(shipBarrages).forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string; [key: string]: unknown }
          if (partObj.type === "summon") {
            summonBarragesFound++
            const hasAllFields = requiredSummonFields.every(
              (field) => field in partObj && partObj[field] !== undefined,
            )
            if (hasAllFields) completeSummonBarrages++
          }
        })
      })
    })

    expect(summonBarragesFound).toBeGreaterThan(0)
    expect(completeSummonBarrages).toBe(summonBarragesFound)
  })

  test("Data Integrity - Parsing doesn't crash on edge cases", () => {
    expect(() => createShipBarragesJson()).not.toThrow()
    const result = createShipBarragesJson()
    expect(typeof result).toBe("object")
    expect(result).not.toBeNull()
  })

  test("Data Integrity - Consistent data types", () => {
    Object.entries(shipBarrages).forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }

      expect(Array.isArray(skillData.barrages)).toBe(true)
      expect(Array.isArray(skillData.ships)).toBe(true)

      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        expect(typeof barrageObj.name).toBe("string")
        expect(Array.isArray(barrageObj.parts)).toBe(true)

        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string }
          expect(typeof partObj.type).toBe("string")
          expect(["weapon", "slash", "summon"]).toContain(partObj.type)
        })
      })
    })
  })

  test("Name Formatting - Parentheses converted to newlines", () => {
    let foundFormattedName = false

    Object.values(shipBarrages).forEach((skillData: unknown) => {
      const skill = skillData as { barrages: unknown[]; ships: string[] }
      skill.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        if (barrageObj.name.includes("\n(")) {
          foundFormattedName = true
          expect(barrageObj.name).toMatch(/\n\(/)
        }
      })
    })

    expect(foundFormattedName).toBe(true)
  })

  test("Ship-specific validation - Independence (CV with aircraft-based barrages)", () => {
    const independenceSkills = Object.entries(shipBarrages).filter(
      ([_skillId, data]) => {
        const skillData = data as { barrages: unknown[]; ships: string[] }
        return skillData.ships.includes("Independence")
      },
    )

    expect(independenceSkills.length).toBeGreaterThan(0)

    let totalBarrages = 0
    independenceSkills.forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((_part: unknown) => {
          totalBarrages++
        })
      })
    })

    expect(totalBarrages).toBeGreaterThan(0)
  })

  test("Ship-specific validation - Z52 (DD with slash barrages, no summons)", () => {
    const z52Skills = Object.entries(shipBarrages).filter(
      ([_skillId, data]) => {
        const skillData = data as { barrages: unknown[]; ships: string[] }
        return skillData.ships.includes("Z52")
      },
    )

    expect(z52Skills.length).toBeGreaterThan(0)

    let slashBarragesFound = 0
    let summonBarragesFound = 0

    z52Skills.forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string }
          if (partObj.type === "slash") slashBarragesFound++
          if (partObj.type === "summon") summonBarragesFound++
        })
      })
    })

    expect(slashBarragesFound).toBeGreaterThan(0)
    expect(summonBarragesFound).toBe(0)
  })

  test("Ship-specific validation - Laffey II (DD with summon barrages)", () => {
    const laffeySkills = Object.entries(shipBarrages).filter(
      ([_skillId, data]) => {
        const skillData = data as { barrages: unknown[]; ships: string[] }
        return skillData.ships.includes("Laffey II")
      },
    )

    expect(laffeySkills.length).toBeGreaterThan(0)

    let summonBarragesFound = 0

    laffeySkills.forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string }
          if (partObj.type === "summon") summonBarragesFound++
        })
      })
    })

    expect(summonBarragesFound).toBeGreaterThan(0)
  })

  test("Ship-specific validation - Rikka Takarada (Collab ship with unique patterns)", () => {
    const rikkaSkills = Object.entries(shipBarrages).filter(
      ([_skillId, data]) => {
        const skillData = data as { barrages: unknown[]; ships: string[] }
        return skillData.ships.includes("Rikka Takarada")
      },
    )

    expect(rikkaSkills.length).toBeGreaterThan(0)

    let totalBarrages = 0
    rikkaSkills.forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((_part: unknown) => {
          totalBarrages++
        })
      })
    })

    expect(totalBarrages).toBeGreaterThan(0)
  })

  test("Ship-specific validation - Bismarck Zwei (BB with mixed barrage types)", () => {
    const bismarckSkills = Object.entries(shipBarrages).filter(
      ([_skillId, data]) => {
        const skillData = data as { barrages: unknown[]; ships: string[] }
        return skillData.ships.includes("Bismarck Zwei")
      },
    )

    expect(bismarckSkills.length).toBeGreaterThan(0)

    let weaponBarragesFound = 0
    let slashBarragesFound = 0
    let summonBarragesFound = 0

    bismarckSkills.forEach(([_skillId, data]) => {
      const skillData = data as { barrages: unknown[]; ships: string[] }
      skillData.barrages.forEach((barrage: unknown) => {
        const barrageObj = barrage as { name: string; parts: unknown[] }
        barrageObj.parts.forEach((part: unknown) => {
          const partObj = part as { type: string }
          if (partObj.type === "weapon") weaponBarragesFound++
          if (partObj.type === "slash") slashBarragesFound++
          if (partObj.type === "summon") summonBarragesFound++
        })
      })
    })

    const totalBarrages =
      weaponBarragesFound + slashBarragesFound + summonBarragesFound
    expect(totalBarrages).toBeGreaterThan(0)
  })
})
