// Types for the Engine API client
export interface WebhookPayload {
  type: string
  table: string
  record?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
  }
  old_record?: any
}

export interface WebhookResponse {
  success: boolean
  error?: string
  details?: string
}

export interface TestResponse {
  message: string
  endpoint: string
  method: string
  description: string
}

export interface HealthResponse {
  status: string
  timestamp: string
  uptime: number
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
  }
}

// Protected routes types
export interface ProfileResponse {
  id: string
  email: string
  name?: string
}
