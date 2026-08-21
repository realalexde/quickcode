import { Context, Effect, Layer } from "effect"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { Session } from "@/session/session"
import { SessionID } from "./schema"

type Price = {
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
}

// Hardcoded estimated prices in USD per 1M tokens for common models.
const PRICES: Record<string, Price> = {
  "anthropic/claude-3-5-sonnet": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  "anthropic/claude-3-5-haiku": { input: 0.8, output: 4, cacheRead: 0.08, cacheWrite: 1 },
  "anthropic/claude-3-opus": { input: 15, output: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  "anthropic/claude-sonnet-4": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  "anthropic/claude-sonnet-4-0": { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 },
  "anthropic/claude-opus-4": { input: 15, output: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  "anthropic/claude-opus-4-0": { input: 15, output: 75, cacheRead: 1.5, cacheWrite: 18.75 },
  "openai/gpt-4o": { input: 2.5, output: 10, cacheRead: 1.25, cacheWrite: 5 },
  "openai/gpt-4o-mini": { input: 0.15, output: 0.6, cacheRead: 0.075, cacheWrite: 0.3 },
  "openai/o1": { input: 15, output: 60, cacheRead: 7.5, cacheWrite: 30 },
  "openai/o3": { input: 10, output: 40, cacheRead: 2.5, cacheWrite: 10 },
  "google/gemini-1.5-pro": { input: 1.25, output: 5, cacheRead: 0.31, cacheWrite: 1.25 },
  "google/gemini-1.5-flash": { input: 0.075, output: 0.3, cacheRead: 0.018, cacheWrite: 0.075 },
  "google/gemini-2.0-flash": { input: 0.1, output: 0.4, cacheRead: 0.025, cacheWrite: 0.1 },
  "deepseek/deepseek-chat": { input: 0.27, output: 1.1, cacheRead: 0.07, cacheWrite: 0.27 },
}

const DEFAULT_PRICE: Price = { input: 3, output: 15, cacheRead: 0.3, cacheWrite: 3.75 }

export type Breakdown = {
  id: string
  model: string
  input: number
  output: number
  reasoning: number
  cacheRead: number
  cacheWrite: number
  cost: number
}

export type Report = {
  total: {
    input: number
    output: number
    reasoning: number
    cacheRead: number
    cacheWrite: number
    cost: number
    messages: number
  }
  perMessage: Breakdown[]
}

export interface Interface {
  readonly report: (sessionID: SessionID, verbose: boolean) => Effect.Effect<Report>
  readonly format: (report: Report, verbose: boolean) => Effect.Effect<string>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/Cost") {}

const priceFor = (providerID: string, modelID: string): Price => {
  return PRICES[`${providerID}/${modelID}`] ?? DEFAULT_PRICE
}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const sessions = yield* Session.Service

    const report = Effect.fn("Cost.report")(function* (sessionID: SessionID, verbose: boolean) {
      const messages = yield* sessions.messages({ sessionID }).pipe(Effect.orDie)
      const perMessage: Breakdown[] = []
      const total = {
        input: 0,
        output: 0,
        reasoning: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: 0,
        messages: 0,
      }

      for (const message of messages) {
        if (message.info.role !== "assistant") continue
        const tokens = message.info.tokens
        const price = priceFor(message.info.providerID, message.info.modelID)
        const cost =
          (tokens.input / 1e6) * price.input +
          (tokens.output / 1e6) * price.output +
          (tokens.cache.read / 1e6) * price.cacheRead +
          (tokens.cache.write / 1e6) * price.cacheWrite
        total.input += tokens.input
        total.output += tokens.output
        total.reasoning += tokens.reasoning
        total.cacheRead += tokens.cache.read
        total.cacheWrite += tokens.cache.write
        total.cost += cost
        total.messages += 1
        if (verbose) {
          perMessage.push({
            id: message.info.id,
            model: `${message.info.providerID}/${message.info.modelID}`,
            input: tokens.input,
            output: tokens.output,
            reasoning: tokens.reasoning,
            cacheRead: tokens.cache.read,
            cacheWrite: tokens.cache.write,
            cost,
          })
        }
      }

      return { total, perMessage }
    })

    const format = Effect.fn("Cost.format")(function* (r: Report, verbose: boolean) {
      const t = r.total
      const lines = [
        "Session token usage:",
        `  Messages:    ${t.messages}`,
        `  Input:       ${Math.round(t.input)} tokens`,
        `  Output:      ${Math.round(t.output)} tokens`,
        `  Reasoning:   ${Math.round(t.reasoning)} tokens`,
        `  Cache read:  ${Math.round(t.cacheRead)} tokens`,
        `  Cache write: ${Math.round(t.cacheWrite)} tokens`,
        `  Estimated cost: $${t.cost.toFixed(4)}`,
      ]
      if (verbose && r.perMessage.length > 0) {
        lines.push("", "Per-message breakdown:")
        for (const m of r.perMessage) {
          lines.push(
            `  ${m.id}`,
            `    model: ${m.model}`,
            `    in: ${Math.round(m.input)}  out: ${Math.round(m.output)}  reasoning: ${Math.round(m.reasoning)}  cache: ${Math.round(m.cacheRead)}/${Math.round(m.cacheWrite)}`,
            `    cost: $${m.cost.toFixed(4)}`,
          )
        }
      }
      return lines.join("\n")
    })

    return Service.of({ report, format })
  }),
)

export const node = LayerNode.make({ service: Service, layer, deps: [Session.node] })

