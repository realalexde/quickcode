import { quickcodeProvider } from "./provider"

// Default QuickCode configuration. Drop this under `.quickcode/quickcode.json`
// (project) or `~/.config/quickcode/quickcode.json` (global) so the app uses
// your models instead of opencode's built-ins.
export const defaultConfig = {
  $schema: "https://opencode.ai/config.json",
  provider: {
    quickcode: quickcodeProvider,
  },
  // Surface QuickCode as the default provider for new sessions.
  model: "quickcode/chat",
} as const

export type DefaultConfig = typeof defaultConfig
