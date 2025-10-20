import { mkdirSync } from "node:fs"
import {
  createEquipAndAugBarrageJson,
  createShipBarragesJson,
} from "@/barrage/utils/jsonParser"
import { convertJsonToLua } from "@/barrage/utils/luaConverter"

const main = async () => {
  console.log("Starting barrage datamine...")

  // Ensure output directory exists
  mkdirSync("output", { recursive: true })

  try {
    // Create ship barrages
    const shipBarrages = createShipBarragesJson()
    await Bun.write(
      "output/barrages.json",
      JSON.stringify(shipBarrages, null, 2),
    )
    console.log("output/barrages.json written")

    // Create equip/augment barrages
    const equipBarrages = createEquipAndAugBarrageJson()
    await Bun.write(
      "output/barrages2.json",
      JSON.stringify(equipBarrages, null, 2),
    )
    console.log("output/barrages2.json written")

    // Convert to Lua
    await convertJsonToLua(shipBarrages, "output/data.lua")
    await convertJsonToLua(equipBarrages, "output/data2.lua")

    console.log("All barrage data written successfully.")
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
