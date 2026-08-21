import path from "path"

process.env.QUICKCODE_DB = ":memory:"
process.env.QUICKCODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.QUICKCODE_DISABLE_MODELS_FETCH = "true"
