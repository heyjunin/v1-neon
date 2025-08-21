import { hc } from 'hono/client'

// Import types from local types file
export * from './types'

// For now, we'll create a client without the AppType import
// This will be resolved once the engine package is properly built
export const createEngineClient = (baseUrl: string = 'http://localhost:3004') => {
  return hc(baseUrl)
}

// Export a default client instance for convenience
export const engineClient = createEngineClient()

// Export the hc function for advanced usage
export { hc }

// Export types for better DX
export type {
  InferRequestType,
  InferResponseType
} from 'hono/client'

