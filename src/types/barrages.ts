import type { Hull, ScalableStatKey, WeaponStat } from "@/types/common"
import type {
  AimType,
  AmmoType,
  BulletType,
  WeaponType,
} from "@/types/equipments"

export interface BarrageEntry<T> {
  type: T
  buffs?: string[]
  buff_chance?: number
}

export interface DamagingBarrage<T> extends BarrageEntry<T> {
  damage: number
  count: number
}

export interface BarrageWeapon extends DamagingBarrage<"weapon"> {
  fix_damage?: number
  coefficient: number
  range: number[]
  armor_mod: number[]
  ammo: AmmoType
  is_critical: boolean
  shrapnel: boolean
  ignore_shield: boolean
  aim_type: AimType
  splash?: number
  velocity?: number
  pierce?: number
  shell_range?: number[]
  spread?: number[]
  reaim?: boolean
  stat: WeaponStat | "fleetpower"
  stat_cap?: number
  ratio: number
  angle: number
  notes: string[]
  is_air?: boolean
  airdrop?: boolean
  tracker?: {
    angular: number
    range: number
  }
  targeting: string | null
  centered: boolean
  weapon_type: WeaponType
  weapon_id: number
  bullet_type: BulletType
  bullet_id: number
}

export interface BarrageSlash extends DamagingBarrage<"slash"> {
  level_of: string
  clears: BulletType[]
  velocity: number
  movement_type: 0 | 1 // stationary | travels
  life_time: number
  range: number
  fix_damage: number
}

export interface BarrageSummonBase extends BarrageEntry<"summon"> {
  weapons: Array<BarrageWeapon & { rld: string }>
  hull: Hull
  armor: number
}

export type BarrageSummon = BarrageSummonBase & Record<ScalableStatKey, string>

export type BarragePart = BarrageWeapon | BarrageSlash | BarrageSummon

export interface ShipBarrageInfo {
  name: string
  is_aoa?: boolean
  barrageParts: BarragePart[]
}

export interface ShipSkillBarrage {
  skillName: string
  barrageInfo: ShipBarrageInfo
}

export interface ShipBarrageData {
  ship: ShipSkillBarrage[]
}

export interface BarrageData {
  [skillId: string]: Array<{
    name: string
    parts: unknown[]
  }>
}
