import type { AugmentData } from "@/data/types/augments"
import type { Barrage } from "@/data/types/barrages"
import type { SkillUpgradeData } from "@/data/types/common"
import type { EquipmentData } from "@/data/types/equipments"
import type { ShipData } from "@/data/types/ships"
import type { SkillData } from "@/data/types/skills"
import type { ParsedBarrage, ParsedBarrageData } from "@/src/types"

// Load JSON data
const barrages: Record<string, Barrage[]> = await Bun.file(
  "./AzurLaneData/data/barrages.json",
).json()
const skillsData: Record<string, SkillData> = await Bun.file(
  "./AzurLaneData/data/skills.json",
).json()
const shipsData: Record<string, ShipData> = await Bun.file(
  "./AzurLaneData/data/ships.json",
).json()
const equipmentsData: Record<string, EquipmentData> = await Bun.file(
  "./AzurLaneData/data/equipments.json",
).json()
const augmentsData: Record<string, AugmentData> = await Bun.file(
  "./AzurLaneData/data/augments.json",
).json()

// Helper function to get skill IDs from a ship
function getShipSkillIds(ship: ShipData): number[] {
  // Use skills[3] if it exists, otherwise use the last available skills array
  if (ship.skills.length > 3 && ship.skills[3]) {
    return ship.skills[3]
  } else if (ship.skills.length > 0) {
    const lastSkills = ship.skills[ship.skills.length - 1]
    return lastSkills || []
  }
  return []
}

// Helper function to get skill IDs from equipment
function getEquipmentSkillIds(equip: EquipmentData): number[] {
  return equip.skills
}

// Helper function to get skill IDs from augment
function getAugmentSkillIds(augment: AugmentData): number[] {
  return augment.skills
}

// Helper function to apply skill upgrades
function _applySkillUpgrades(
  skillIds: number[],
  upgrades: SkillUpgradeData[],
): number[] {
  const upgraded = [...skillIds]
  for (const upgrade of upgrades) {
    if (upgrade.replace !== null) {
      // Add the upgraded skill instead of replacing
      upgraded.push(upgrade.with)
    }
  }
  return upgraded
}

// Helper function to get barrage data for a skill ID
function getBarrageForSkill(skillId: number): Barrage[] | null {
  const skillIdStr = skillId.toString()
  return barrages[skillIdStr] || null
}

// Helper function to get skill info
function getSkillInfo(skillId: number): SkillData | null {
  const skillIdStr = skillId.toString()
  return skillsData[skillIdStr] || null
}

// Main function to build ParsedBarrageData
export const buildParsedBarrageData = async (): Promise<ParsedBarrageData> => {
  const result: ParsedBarrageData = {}

  // Process ships
  for (const [_shipId, ship] of Object.entries(shipsData)) {
    const skillSources: Map<number, "ship" | "retrofit" | "fate" | "augment"> =
      new Map()

    // Base skills
    const baseSkillIds = getShipSkillIds(ship)
    for (const skillId of baseSkillIds) {
      skillSources.set(skillId, "ship")
    }

    // Retrofit skills
    if (ship.retro) {
      for (const upgrade of ship.retro.skills) {
        if (upgrade.replace !== null && upgrade.with !== null) {
          skillSources.set(upgrade.with, "retrofit")
        }
      }
    }

    // Fate simulation skills
    if (ship.research) {
      for (const research of ship.research) {
        if (research.fate) {
          for (const upgrade of research.fate.skills) {
            if (upgrade.replace !== null && upgrade.with !== null) {
              skillSources.set(upgrade.with, "fate")
            }
          }
        }
      }
    }

    // Augment skills
    if (ship.unique_aug) {
      const augment = augmentsData[ship.unique_aug.toString()]
      if (augment) {
        const augmentSkillIds = getAugmentSkillIds(augment)
        for (const skillId of augmentSkillIds) {
          skillSources.set(skillId, "augment")
        }
        for (const upgrade of augment.skill_upgrades) {
          if (upgrade.replace !== null && upgrade.with !== null) {
            skillSources.set(upgrade.with, "augment")
          }
        }
      }
    }

    // Collect all unique skill IDs
    const allSkillIds = Array.from(skillSources.keys())

    const parsedBarrages: ParsedBarrage[] = []
    for (const skillId of allSkillIds) {
      const skillInfo = getSkillInfo(skillId)
      const barrage = getBarrageForSkill(skillId)
      const barrageType = skillSources.get(skillId) || "ship"
      parsedBarrages.push({
        skillId: skillId,
        skillName: skillInfo?.name || null,
        skillType: skillInfo?.type || 0,
        barrageType: barrageType,
        barrage: barrage,
      })
    }
    result[ship.name] = parsedBarrages
  }

  // Process equipments
  for (const [_equipId, equip] of Object.entries(equipmentsData)) {
    const skillIds = getEquipmentSkillIds(equip)
    const parsedBarrages: ParsedBarrage[] = []
    for (const skillId of skillIds) {
      const skillInfo = getSkillInfo(skillId)
      const barrage = getBarrageForSkill(skillId)
      parsedBarrages.push({
        skillId: skillId,
        skillName: skillInfo?.name || null,
        skillType: skillInfo?.type || 0,
        barrageType: "equip",
        barrage: barrage,
      })
    }
    result[equip.name] = parsedBarrages
  }

  // Process augments
  for (const [_augmentId, augment] of Object.entries(augmentsData)) {
    const skillIds = getAugmentSkillIds(augment)
    const parsedBarrages: ParsedBarrage[] = []
    for (const skillId of skillIds) {
      const skillInfo = getSkillInfo(skillId)
      const barrage = getBarrageForSkill(skillId)
      parsedBarrages.push({
        skillId: skillId,
        skillName: skillInfo?.name || null,
        skillType: skillInfo?.type || 0,
        barrageType: "augment",
        barrage: barrage,
      })
    }
    result[augment.name] = parsedBarrages
  }

  return result
}
