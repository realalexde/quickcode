import { Context, Effect, Layer } from "effect"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { InstanceState } from "@/effect/instance-state"

type State = {
  text: string | undefined
  running: boolean
  startedAt: number | undefined
  log: string[]
}

export type Status = {
  active: boolean
  text: string | undefined
  startedAt: number | undefined
  log: string[]
}

export interface Interface {
  readonly start: (text: string) => Effect.Effect<void>
  readonly stop: () => Effect.Effect<void>
  readonly markComplete: () => Effect.Effect<void>
  readonly log: (entry: string) => Effect.Effect<void>
  readonly status: () => Effect.Effect<Status>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/Goal") {}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const state = yield* InstanceState.make<State>(() => Effect.succeed({ text: undefined, running: false, startedAt: undefined, log: [] }))

    const start = Effect.fn("Goal.start")(function* (text: string) {
      const s = yield* InstanceState.get(state)
      s.text = text
      s.running = true
      s.startedAt = Date.now()
      s.log = [`started: ${text}`]
    })

    const stop = Effect.fn("Goal.stop")(function* () {
      const s = yield* InstanceState.get(state)
      if (s.running) s.log = [...s.log, "stopped by user"]
      s.running = false
    })

    const markComplete = Effect.fn("Goal.markComplete")(function* () {
      const s = yield* InstanceState.get(state)
      if (s.running) s.log = [...s.log, "completed"]
      s.running = false
    })

    const log = Effect.fn("Goal.log")(function* (entry: string) {
      const s = yield* InstanceState.get(state)
      s.log = [...s.log, entry]
    })

    const status = Effect.fn("Goal.status")(function* () {
      const s = yield* InstanceState.get(state)
      return { active: s.running, text: s.text, startedAt: s.startedAt, log: [...s.log] }
    })

    return Service.of({ start, stop, markComplete, log, status })
  }),
)

export const node = LayerNode.make({ service: Service, layer, deps: [] })

export * as Goal from "."
