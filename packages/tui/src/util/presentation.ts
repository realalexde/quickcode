import { logo } from "../logo"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const dim = "\x1b[90m"

function wordmark(pad = "") {
  return logo.left.map((line, index) => {
    const left = `${dim}${line.trimEnd()}${reset}`
    const right = `${logo.right[index]?.trimEnd() ?? ""}`
    return `${pad}${left} ${right ? `${reset}${right}` : ""}`
  })
}

export function sessionEpilogue(input: { title: string; sessionID?: string }) {
  const weak = (text: string) => `${dim}${text.padEnd(10, " ")}${reset}`
  return [
    ...wordmark("  "),
    "",
    `  ${weak("Session")}${bold}${input.title}${reset}`,
    `  ${weak("Continue")}${bold}quickcode -s ${input.sessionID}${reset}`,
    "",
  ].join("\n")
}
