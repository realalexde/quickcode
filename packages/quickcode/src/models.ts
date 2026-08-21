// Model registry for the QuickCode endpoint. The endpoint is OpenAI-compatible
// and exposes its own /models list, so by default the app fetches the available
// models at runtime. Pass a comma-separated `envModels` string (e.g. from
// QUICKCODE_MODELS) to pin a fixed set.
export interface QuickCodeModel {
  id: string
  name?: string
}

export function defaultModels(envModels?: string): QuickCodeModel[] {
  if (!envModels) return []
  return envModels
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => ({ id }))
}
