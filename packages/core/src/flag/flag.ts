import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["QUICKCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["QUICKCODE_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("QUICKCODE_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  QUICKCODE_AUTO_HEAP_SNAPSHOT: truthy("QUICKCODE_AUTO_HEAP_SNAPSHOT"),
  QUICKCODE_GIT_BASH_PATH: process.env["QUICKCODE_GIT_BASH_PATH"],
  QUICKCODE_CONFIG: process.env["QUICKCODE_CONFIG"],
  QUICKCODE_CONFIG_CONTENT: process.env["QUICKCODE_CONFIG_CONTENT"],
  QUICKCODE_DISABLE_AUTOUPDATE: truthy("QUICKCODE_DISABLE_AUTOUPDATE"),
  QUICKCODE_ALWAYS_NOTIFY_UPDATE: truthy("QUICKCODE_ALWAYS_NOTIFY_UPDATE"),
  QUICKCODE_DISABLE_PRUNE: truthy("QUICKCODE_DISABLE_PRUNE"),
  QUICKCODE_DISABLE_TERMINAL_TITLE: truthy("QUICKCODE_DISABLE_TERMINAL_TITLE"),
  QUICKCODE_SHOW_TTFD: truthy("QUICKCODE_SHOW_TTFD"),
  QUICKCODE_DISABLE_AUTOCOMPACT: truthy("QUICKCODE_DISABLE_AUTOCOMPACT"),
  QUICKCODE_DISABLE_MODELS_FETCH: truthy("QUICKCODE_DISABLE_MODELS_FETCH"),
  QUICKCODE_DISABLE_MOUSE: truthy("QUICKCODE_DISABLE_MOUSE"),
  QUICKCODE_FAKE_VCS: process.env["QUICKCODE_FAKE_VCS"],
  QUICKCODE_SERVER_PASSWORD: process.env["QUICKCODE_SERVER_PASSWORD"],
  QUICKCODE_SERVER_USERNAME: process.env["QUICKCODE_SERVER_USERNAME"],
  QUICKCODE_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("QUICKCODE_DISABLE_FFF"),

  // Experimental
  QUICKCODE_EXPERIMENTAL_FILEWATCHER: Config.boolean("QUICKCODE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  QUICKCODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("QUICKCODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  QUICKCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("QUICKCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  QUICKCODE_MODELS_URL: process.env["QUICKCODE_MODELS_URL"],
  QUICKCODE_MODELS_PATH: process.env["QUICKCODE_MODELS_PATH"],
  QUICKCODE_DB: process.env["QUICKCODE_DB"],

  QUICKCODE_WORKSPACE_ID: process.env["QUICKCODE_WORKSPACE_ID"],
  QUICKCODE_EXPERIMENTAL_WORKSPACES: enabledByExperimental("QUICKCODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get QUICKCODE_DISABLE_PROJECT_CONFIG() {
    return truthy("QUICKCODE_DISABLE_PROJECT_CONFIG")
  },
  get QUICKCODE_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("QUICKCODE_EXPERIMENTAL_REFERENCES")
  },
  get QUICKCODE_TUI_CONFIG() {
    return process.env["QUICKCODE_TUI_CONFIG"]
  },
  get QUICKCODE_CONFIG_DIR() {
    return process.env["QUICKCODE_CONFIG_DIR"]
  },
  get QUICKCODE_PURE() {
    return truthy("QUICKCODE_PURE")
  },
  get QUICKCODE_PERMISSION() {
    return process.env["QUICKCODE_PERMISSION"]
  },
  get QUICKCODE_PLUGIN_META_FILE() {
    return process.env["QUICKCODE_PLUGIN_META_FILE"]
  },
  get QUICKCODE_CLIENT() {
    return process.env["QUICKCODE_CLIENT"] ?? "cli"
  },
}
