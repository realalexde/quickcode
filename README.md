# ⚡ QuickCode
> A terminal-native AI coding agent forked from opencode and pointed at your own OpenAI-compatible models — no opencode infrastructure required.

---

## What it does

QuickCode is a fork of [opencode](https://github.com/anomalyco/opencode) rebranded and reconfigured to run against a self-hosted model endpoint instead of opencode's hosted providers. Config lives in `.quickcode/quickcode.json` and the provider registry is isolated in its own package, so opencode's built-in models never cross into your setup. You point it at your endpoint and it just works.

---

## 🚀 Quick Start

1. Install dependencies:
   ```sh
   bun install
   ```
2. Run the live TUI:
   ```sh
   cd packages/opencode && bun run dev
   ```
3. Or build and run the binary:
   ```sh
   bun run build && ./bin/opencode
   ```

---

## Usage

| Command | Description |
| --- | --- |
| `/focus <path\|glob>` | Scope the agent's attention to specific files. |
| `/focus list` | Show current focus paths. |
| `/focus clear` | Clear focus. |
| `/cost [verbose]` | Show session token and cost usage. |
| `/goal <text>` | Start autonomous execution toward a goal. |
| `/goal status` | Show the active goal and progress log. |
| `/goal stop` | Stop autonomous execution. |

---

## ⚙️ Configuration

Config is read from `quickcode.json` (project dir) or `~/.config/quickcode/quickcode.json`. A default is provided at the repo root.

| Variable | Default | Description |
| --- | --- | --- |
| `baseUrl` | `http://pg.ftp.sh:5000/v1` | OpenAI-compatible endpoint for your models. |
| `QUICKCODE_API_KEY` | `sk-quickcode` | API key sent to the endpoint. |
| `QUICKCODE_MODELS` | _(unset)_ | Comma-separated model IDs to pin; otherwise models are fetched from `${baseUrl}/models`. |

---

## 🔧 How it works

1. Config loads from `.quickcode/quickcode.json` and merges with the global `~/.config/quickcode/quickcode.json`.
2. The `quickcode` provider resolves to `http://pg.ftp.sh:5000/v1` and lists models from its `/models` endpoint.
3. Sessions stream completions through the OpenAI-compatible endpoint — `client → quickcode provider → http://pg.ftp.sh:5000/v1`.

---

## 📁 File structure

| File | What it does |
| --- | --- |
| `packages/quickcode` | Isolated provider + model registry for your endpoint. |
| `packages/opencode` | Agent core (forked from opencode). |
| `packages/app` | Desktop / web UI. |
| `packages/core` | Shared services and config loading. |
| `packages/tui` | Terminal UI and ASCII logo. |
| `quickcode.json` | Default provider configuration. |

---

## 🔗 Repository

[github.com/realalexde/quickcode](https://github.com/realalexde/quickcode)
