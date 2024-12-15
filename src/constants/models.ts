// Model identifiers
export const MODEL_BEST = 'gpt-4o'
export const MODEL_FAST = 'gpt-4o-mini'

// Default model configuration
export const DEFAULT_MODEL = MODEL_BEST
export const FALLBACK_MODEL = MODEL_FAST

// Model constants for external use
export const MODELS = {
  BEST: MODEL_BEST,
  FAST: MODEL_FAST,
} as const

// Model type definitions
export type ModelType = (typeof MODELS)[keyof typeof MODELS]
