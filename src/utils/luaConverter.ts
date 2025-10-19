export const jsonToLua = (data: unknown, indent = ""): string => {
  if (Array.isArray(data)) {
    if (data.length === 0) return "{}"
    const items = data.map((x) => jsonToLua(x, indent))
    return `{ ${items.join(", ")} }`
  } else if (typeof data === "object" && data !== null) {
    if (Object.keys(data).length === 0) return "{}"

    const obj = data as Record<string, unknown>
    const lines: string[] = []
    // Sort keys for consistent output
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      const aNum = /^\d+$/.test(a)
      const bNum = /^\d+$/.test(b)
      if (aNum && bNum) return parseInt(a, 10) - parseInt(b, 10)
      if (aNum) return -1
      if (bNum) return 1
      return a.localeCompare(b)
    })

    for (const k of sortedKeys) {
      const val = obj[k]
      const key = /^[A-Za-z_]\w*$/.test(k) ? k : `["${k}"]`
      lines.push(`${indent}  ${key} = ${jsonToLua(val, `${indent}  `)}`)
    }

    return `{\n${lines.join(",\n")}\n${indent}}`
  } else if (typeof data === "string") {
    return (
      '"' +
      data.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") +
      '"'
    )
  } else if (typeof data === "boolean") {
    return data ? "true" : "false"
  } else if (typeof data === "number") {
    return data.toString()
  } else {
    return "nil"
  }
}

export const convertJsonToLua = async (
  inputData: unknown,
  outputPath: string,
) => {
  const luaBody = jsonToLua(inputData)
  const outputContent = `local p = ${luaBody}\n\nreturn p\n`
  await Bun.write(outputPath, outputContent)
  console.log(`Lua module written to ${outputPath}`)
}
