import type { Hooks, PluginInput } from "@opencode-ai/plugin"
import type { Model } from "@opencode-ai/sdk/v2"

const QUICKCODE_API = "http://real.ftp.sh:5000/v1"

// Cheap placeholder pricing (USD per token). Adjust whenever real rates land.
const COSTS: Record<string, { input: number; output: number }> = {
  auto: { input: 1e-6, output: 2e-6 },
  fast: { input: 5e-7, output: 1e-6 },
  "nemotron-3-ultra": { input: 2e-6, output: 4e-6 },
  "big-pickle": { input: 2e-6, output: 4e-6 },
  "mimo-v2.5": { input: 1.5e-6, output: 3e-6 },
  hy3: { input: 1e-6, output: 2e-6 },
  "laguna-s-2.1": { input: 1.5e-6, output: 3e-6 },
  "x-preview-f": { input: 1e-6, output: 2e-6 },
  "nemotron-3.5-lightning": { input: 8e-7, output: 1.6e-6 },
}
const DEFAULT_COST = { input: 1e-6, output: 2e-6 }

interface RemoteModel {
  id: string
  object?: string
  created?: number
  owned_by?: string
}

async function listModels(baseURL: string): Promise<RemoteModel[]> {
  const res = await fetch(`${baseURL}/models`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  }).catch(() => undefined)
  if (!res || !res.ok) return []
  const body = (await res.json().catch(() => undefined)) as
    | { data?: RemoteModel[] }
    | undefined
  return body?.data ?? []
}

function remoteModel(id: string, baseURL: string): Model {
  const c = COSTS[id] ?? DEFAULT_COST
  return {
    id,
    providerID: "quickcode",
    name: id,
    family: "",
    api: { id, url: baseURL, npm: "@ai-sdk/openai-compatible" },
    status: "active",
    headers: {},
    options: {},
    cost: { input: c.input, output: c.output, cache: { read: c.input * 0.5, write: c.input * 0.25 } },
    limit: { context: 200_000, output: 8_192 },
    capabilities: {
      temperature: true,
      reasoning: false,
      attachment: true,
      toolcall: true,
      input: { text: true, audio: false, image: true, video: false, pdf: true },
      output: { text: true, audio: false, image: false, video: false, pdf: false },
      interleaved: false,
    },
    release_date: "",
    variants: {},
  }
}

export async function QuickCodePlugin(_input: PluginInput): Promise<Hooks> {
  return {
    provider: {
      id: "quickcode",
      async models(provider, ctx) {
        const remote = await listModels(QUICKCODE_API)
        if (remote.length === 0) return provider.models
        const models: Record<string, Model> = {}
        for (const m of remote) {
          if (!m.id) continue
          models[m.id] = remoteModel(m.id, QUICKCODE_API)
        }
        return models
      },
    },
  }
}
