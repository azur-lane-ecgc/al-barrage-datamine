import { expect, test } from "bun:test"
import { buildParsedBarrageData } from "@/src/barrageParse"

test("parses Warspite barrages correctly", async () => {
  const data = await buildParsedBarrageData()
  const warspite = data.Warspite

  expect(warspite).toBeDefined()
  expect(warspite?.length).toBeGreaterThan(0)

  // Check for base Divine Marksman
  const divineMarksman = warspite?.find(
    (b) => b.skillName === "Divine Marksman",
  )
  expect(divineMarksman).toBeDefined()
  expect(divineMarksman?.skillType).toBe(1) // Offensive
  expect(divineMarksman?.barrageType).toBe("ship")
  expect(divineMarksman?.barrage).toBeDefined()
  expect(divineMarksman?.barrage?.length).toBeGreaterThan(0)

  // Check for retrofit version
  const divineMarksmanR = warspite?.find(
    (b) => b.skillName === "Divine Marksman (R)",
  )
  expect(divineMarksmanR).toBeDefined()
  expect(divineMarksmanR?.barrageType).toBe("retrofit")

  // Check for augment versions
  const divineMarksmanPlus = warspite?.find(
    (b) => b.skillName === "Divine Marksman+",
  )
  expect(divineMarksmanPlus).toBeDefined()
  expect(divineMarksmanPlus?.barrageType).toBe("augment")

  const divineMarksmanRPlus = warspite?.find(
    (b) => b.skillName === "Divine Marksman (R)+",
  )
  expect(divineMarksmanRPlus).toBeDefined()
  expect(divineMarksmanRPlus?.barrageType).toBe("augment")
})

test("parses San Diego barrages correctly", async () => {
  const data = await buildParsedBarrageData()
  const sanDiego = data["San Diego"]

  expect(sanDiego).toBeDefined()
  expect(sanDiego?.length).toBeGreaterThan(0)

  // San Diego should have barrages
  const barragesWithData = sanDiego?.filter(
    (b) => b.barrage && b.barrage.length > 0,
  )
  expect(barragesWithData.length).toBeGreaterThan(0)
})

test("parses Taihou barrages correctly", async () => {
  const data = await buildParsedBarrageData()
  const taihou = data.Taihou

  expect(taihou).toBeDefined()
  expect(taihou?.length).toBeGreaterThan(0)

  // Taihou should have barrages
  const barragesWithData = taihou?.filter(
    (b) => b.barrage && b.barrage.length > 0,
  )
  expect(barragesWithData.length).toBeGreaterThan(0)
})

test("parses Takao barrages correctly", async () => {
  const data = await buildParsedBarrageData()
  const takao = data.Takao

  expect(takao).toBeDefined()
  expect(takao?.length).toBeGreaterThan(0)

  // Takao should have barrages
  const barragesWithData = takao?.filter(
    (b) => b.barrage && b.barrage.length > 0,
  )
  expect(barragesWithData.length).toBeGreaterThan(0)
})
