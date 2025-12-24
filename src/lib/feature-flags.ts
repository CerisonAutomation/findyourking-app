/* Feature flag management */

interface FeatureFlags {
  [key: string]: boolean | string | number
}

let flags: FeatureFlags = {
  newMatching: false,
  advancedSearch: false,
  premiumFeatures: false,
  betaUI: false,
}

export function initFeatureFlags(userFlags: FeatureFlags) {
  flags = { ...flags, ...userFlags }
}

export function isFeatureEnabled(flag: string): boolean {
  return Boolean(flags[flag])
}

export function getFeatureValue(flag: string): any {
  return flags[flag]
}

export function setFeatureFlag(flag: string, value: boolean) {
  flags[flag] = value
}

export function getAllFlags(): FeatureFlags {
  return { ...flags }
}
