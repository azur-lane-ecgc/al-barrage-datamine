import type { Barrage } from "@/data/types/barrages"
import type { SkillType } from "@/data/types/skills"

// interface ImprovedBarrage extends Omit<Barrage, "name"> {
//   nameNote: string
// }

export interface ParsedBarrage {
  skillName: string | null
  skillType: SkillType
  skillId: number
  barrageType: ("ship" | "equip" | "augment" | "retrofit" | "fate") | null
  barrage: Barrage[] | null
}

// id is either the ship name or the equipment name
// ParsedBarrage is an Array, as there is one object per skill and ships can have multiple skills
export interface ParsedBarrageData {
  [id: string]: ParsedBarrage[]
}
