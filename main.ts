import { buildParsedBarrageData } from "@/src/barrageParse"

// Get output file path from command line argument, default to ./output/data.json
const outputPath = process.argv[2] || "./output/data.json"

const main = async () => {
  const parsedData = await buildParsedBarrageData()
  Bun.write(outputPath, JSON.stringify(parsedData, null, 2))
  console.log(`Parsed barrage data written to ${outputPath}`)
}

main().catch((error: unknown) => {
  console.error("Error during parsing:", error)
})
