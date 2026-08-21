export const QUICKCODE_API_BASE = "http://real.ftp.sh:5000/v1"

// Isolated provider definition for the QuickCode model endpoint.
// Kept entirely separate from opencode's built-in provider registry so no
// opencode models cross into QuickCode.
export const quickcodeProvider = {
  type: "openai-compatible",
  baseUrl: QUICKCODE_API_BASE,
  apiKey: "sk-quickcode",
  models: {
    fetch: true,
  },
} as const

export type QuickCodeProvider = typeof quickcodeProvider
