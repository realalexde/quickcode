export const BETTER_MARKDOWN_SKILL_BODY = `---
name: better-markdown
description: Write or rewrite a GitHub README in realalexde's style — clean, minimal, structured. Use this skill whenever the user asks to write, improve, fix, or rewrite a README, or says something like "make a README for X", "redo the README", "same style as before". Always trigger for any README-related request, especially for developer tools, bots, scripts, CLI utilities, or any open-source project.
---

# README Style — realalexde

Write or rewrite GitHub README files in a clean, minimal, developer-first style. No fluff. No badges wall. No long introductions. Just what someone needs to understand, install, and use the project.

---

## Style Rules

### Structure (always in this order)

1. **Title + one-liner** — project name as H1, then a \`>\` blockquote with one sentence: what it is and why it exists
2. **What it does** — short prose paragraph (2–4 sentences) that explains the concept, not just features. End with the "elevator pitch" — what makes it different or worth using.
3. **Quick Start / Setup** — numbered steps, code blocks for every command. If Docker and direct both exist, show both. Keep it minimal — only what's needed to run.
4. **Usage / How to use** — commands, flags, examples. Use a table for flags/options if there are more than 3.
5. **How it works** *(optional, only if non-obvious)* — numbered list, one line per step. Include a flow arrow like \`client → proxy → service\` if helpful.
6. **Configuration** *(optional)* — table with columns: Variable | Default | Description
7. **File structure** *(optional)* — table with columns: File | What it does
8. **Features** *(optional)* — bullet list, grouped by category if there are many. Keep each bullet to one line.
9. **Stack** *(optional)* — short list of key dependencies with links, only if relevant
10. **Repository link** — always last, as \`[github.com/user/repo](url)\`

### Formatting rules

- Title: \`# 📦 ProjectName\` — one relevant emoji, then name
- One-liner: \`> Short description — key differentiator.\`
- Section dividers: \`---\` between every major section
- Code blocks: always with language tag (\`\`\`sh\`, \`\`\`python\`, etc.)
- Tables: use for anything with 3+ items that have parallel structure (flags, files, endpoints, env vars)
- Bullet lists: only for features or stack — not for steps (use numbered lists instead)
- No bold inside prose — bold only in table headers or feature labels
- No "Installation" as a section name — use "Quick Start" or "Setup"
- No "Prerequisites" section — fold requirements into the setup step itself
- No repeated links — link each thing once, inline where first mentioned

### Tone

- Direct and technical. No marketing language.
- Assume the reader is a developer. Don't explain what Python is.
- Short sentences. Cut any sentence that doesn't add information.
- No "feel free to", "simply", "easy to", "powerful", "robust", "seamless".

### What NOT to include

- Badges (shields.io, etc.) unless explicitly requested
- Contributing section (unless explicitly requested)
- License section (unless explicitly requested)
- Long feature lists that repeat what the description already said
- Sections with only one item
- Filler phrases: "Welcome to X", "X is a Y that Z", "This project aims to"

---

## Process

1. **Read the code or repo** — fetch the main files to understand what the project actually does, not just what the existing README says
2. **Identify the core concept** — one sentence that captures what it is and why someone would use it
3. **Extract the real setup steps** — from package files, Dockerfiles, or source code — not from the old README
4. **Find all commands, flags, env vars** — from source, not from memory
5. **Write the README** following the structure above
6. **Output as a \`.md\` file** — always create a file, don't paste in chat

---

## Examples of good one-liners

- \`> OpenAI- and Anthropic-compatible proxy over OpenCode Zen with automatic VLESS IP rotation — no API key required.\`
- \`> A portable project format — pack an entire project into a single .zip.txt file you can copy, paste, and send anywhere.\`
- \`> Android root detection in a single shell script — no dependencies, no installs, just copy-paste.\`

## Examples of bad one-liners

- \`> A powerful and flexible tool for managing your projects.\`
- \`> This bot allows you to chat with Ollama models via Telegram.\`
- \`> zenrelay is a proxy that routes requests through VLESS IPs.\`

---

## Template (copy and fill)

\`\`\`markdown
# <emoji> ProjectName
> <One sentence: what it is — what makes it worth using.>

---

## What it does

<2–4 sentences. Concept first, then what it enables. End with the pitch.>

---

## 🚀 Quick Start

<Numbered steps. Code block for every command.>

---

## Usage

<Commands, flags, examples. Table if 3+ options.>

---

## ⚙️ Configuration (if applicable)

| Variable | Default | Description |
|---|---|---|
| ... | ... | ... |

---

## 🔧 How it works (if non-obvious)

1. Step one
2. Step two
...

---

## 🔗 Repository

[github.com/user/repo](https://github.com/user/repo)
\`\`\`
`
