import { augmentData, barrageData, equipmentData, shipData } from "./data"

export const createShipBarragesJson = (): Record<
  string,
  { barrages: unknown[]; ships: string[] }
> => {
  console.log("Creating ship barrages JSON...")

  const ships = shipData
  const barrages = barrageData
  const augments = augmentData

  const allSkillIds = new Set<number>()
  const skillToShips: Record<number, Set<string>> = {}

  const addSkillAndShip = (skillId: number, shipName: string) => {
    allSkillIds.add(skillId)
    if (!skillToShips[skillId]) {
      skillToShips[skillId] = new Set()
    }
    skillToShips[skillId].add(shipName)
  }

  // Process ships
  for (const ship of Object.values(ships)) {
    // Regular skills
    if (ship.skills) {
      for (const skillGroup of ship.skills) {
        if (Array.isArray(skillGroup)) {
          for (const skillId of skillGroup) {
            addSkillAndShip(skillId, ship.name)
          }
        }
      }
    }

    // Retrofit skills
    if (ship.retro?.skills) {
      for (const skill of ship.retro.skills) {
        if (skill.with) {
          addSkillAndShip(skill.with, ship.name)
        }
      }
    }

    // Research skills
    if (ship.research) {
      for (const level of ship.research) {
        if (level.fate?.skills) {
          for (const skill of level.fate.skills) {
            if (skill.with) {
              addSkillAndShip(skill.with, ship.name)
            }
          }
        }
      }
    }

    // Unique augment skills
    if (ship.unique_aug) {
      const augmentId = ship.unique_aug.toString()
      const aug = augments[augmentId]
      if (aug?.skill_upgrades) {
        for (const upgrade of aug.skill_upgrades) {
          if (upgrade.with) {
            addSkillAndShip(upgrade.with, ship.name)
          }
        }
      }
    }
  }

  // Build result
  const result: Record<string, { barrages: unknown[]; ships: string[] }> = {}
  for (const skillId of Array.from(allSkillIds).sort()) {
    const skillIdStr = skillId.toString()
    if (barrages[skillIdStr]) {
      const barrageArray = barrages[skillIdStr]
      const enhancedBarrages = barrageArray.map((barrage) => ({
        ...barrage,
        name: barrage.name.replace(/\s*\(([^)]+)\)$/, "\n($1)"),
      }))

      result[skillIdStr] = {
        barrages: enhancedBarrages,
        ships: Array.from(skillToShips[skillId] || []).sort(),
      }
    }
  }

  console.log(
    `Ship barrages JSON created with ${Object.keys(result).length} entries.`,
  )
  return result
}

export const createEquipAndAugBarrageJson = (): Record<
  string,
  { barrages: unknown[]; equips: string[] }
> => {
  console.log("Creating equipment and augment barrages JSON...")

  const barrages = barrageData
  const augments = augmentData
  const equips = equipmentData

  const allSkillIds = new Set<number>()
  const skillToItems: Record<number, Set<string>> = {}

  const addSkillAndItem = (skillId: number, itemName: string) => {
    allSkillIds.add(skillId)
    if (!skillToItems[skillId]) {
      skillToItems[skillId] = new Set()
    }
    skillToItems[skillId].add(itemName)
  }

  // Process equipment
  for (const equip of Object.values(equips)) {
    if (equip.skills) {
      for (const skillId of equip.skills) {
        addSkillAndItem(skillId, equip.name)
      }
    }
  }

  // Process augments
  for (const augment of Object.values(augments)) {
    if (augment.skills) {
      for (const skillId of augment.skills) {
        addSkillAndItem(skillId, augment.name)
      }
    }
  }

  // Build result
  const result: Record<string, { barrages: unknown[]; equips: string[] }> = {}
  for (const skillId of Array.from(allSkillIds).sort()) {
    const skillIdStr = skillId.toString()
    if (barrages[skillIdStr]) {
      const barrageArray = barrages[skillIdStr]
      const enhancedBarrages = barrageArray.map((barrage) => ({
        ...barrage,
        name: barrage.name.replace(/\s*\(([^)]+)\)$/, "\n($1)"),
      }))

      result[skillIdStr] = {
        barrages: enhancedBarrages,
        equips: Array.from(skillToItems[skillId] || []).sort(),
      }
    }
  }

  console.log(
    `Equip/augment barrages JSON created with ${Object.keys(result).length} entries.`,
  )
  return result
}
