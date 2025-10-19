// Redefined types from AzurLaneData
export interface Ship {
  name: string
  skills?: number[][]
  retro?: {
    skills?: Array<{ with?: number }>
  }
  research?: Array<{
    fate?: {
      skills?: Array<{ with?: number }>
    }
  }>
  unique_aug?: number
}

export interface Augment {
  skill_upgrades?: Array<{ with?: number }>
  skills?: number[]
  name: string
}

export interface Equipment {
  name: string
  skills?: number[]
}
