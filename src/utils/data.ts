import augmentsData from "@/data/augments.json"
import barragesData from "@/data/barrages.json"
import equipmentsData from "@/data/equipments.json"
import shipsData from "@/data/ships.json"
import type { Augment, BarrageData, Equipment, Ship } from "@/types"

export const shipData = shipsData as Record<string, Ship>
export const barrageData = barragesData as BarrageData
export const equipmentData = equipmentsData as Record<string, Equipment>
export const augmentData = augmentsData as Record<string, Augment>
