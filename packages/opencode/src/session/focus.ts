import { Context, Effect, Layer } from "effect"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { InstanceState } from "@/effect/instance-state"

type State = {
  paths: string[]
}

export interface Interface {
  readonly add: (path: string) => Effect.Effect<readonly string[]>
  readonly remove: (path: string) => Effect.Effect<readonly string[]>
  readonly clear: () => Effect.Effect<void>
  readonly list: () => Effect.Effect<readonly string[]>
  readonly render: () => Effect.Effect<string | undefined>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/Focus") {}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const state = yield* InstanceState.make<State>(() => Effect.succeed({ paths: [] }))

    const add = Effect.fn("Focus.add")(function* (path: string) {
      const s = yield* InstanceState.get(state)
      if (s.paths.includes(path)) return s.paths
      s.paths = [...s.paths, path]
      return s.paths
    })

    const remove = Effect.fn("Focus.remove")(function* (path: string) {
      const s = yield* InstanceState.get(state)
      s.paths = s.paths.filter((p) => p !== path)
      return s.paths
    })

    const clear = Effect.fn("Focus.clear")(function* () {
      const s = yield* InstanceState.get(state)
      s.paths = []
    })

    const list = Effect.fn("Focus.list")(function* () {
      const s = yield* InstanceState.get(state)
      return s.paths
    })

    const render = Effect.fn("Focus.render")(function* () {
      const s = yield* InstanceState.get(state)
      if (s.paths.length === 0) return undefined
      return [
        "The user has scoped your attention to the following paths. Prefer reading, searching, and editing within these paths unless the task explicitly requires looking elsewhere:",
        ...s.paths.map((p) => `- ${p}`),
      ].join("\n")
    })

    return Service.of({ add, remove, clear, list, render })
  }),
)

export const node = LayerNode.make({ service: Service, layer, deps: [] })

