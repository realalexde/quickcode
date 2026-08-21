declare global {
  const QUICKCODE_VERSION: string
  const QUICKCODE_CHANNEL: string
}

export const InstallationVersion = typeof QUICKCODE_VERSION === "string" ? QUICKCODE_VERSION : "0.1.2"
export const InstallationChannel = typeof QUICKCODE_CHANNEL === "string" ? QUICKCODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
