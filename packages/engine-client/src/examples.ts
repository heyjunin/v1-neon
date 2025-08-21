import { createEngineClient, engineClient } from './index'
import type { WebhookPayload } from './types'

// Example 1: Using the default client
export async function testHealthCheck() {
  try {
    const response = await engineClient.health.$get()
    
    if (response.ok) {
      const data = await response.json()
      console.log('Health check successful:', data)
      return data
    } else {
      console.error('Health check failed:', response.status)
      return null
    }
  } catch (error) {
    console.error('Health check error:', error)
    return null
  }
}

// Example 2: Using a custom client instance
export async function testWebhookWithCustomClient() {
  const customClient = createEngineClient('http://localhost:3004')
  
  const webhookPayload: WebhookPayload = {
    type: 'INSERT',
    table: 'users',
    record: {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }

  try {
    const response = await customClient.webhooks.supabase.$post({
      json: webhookPayload,
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Webhook sent successfully:', data)
      return data
    } else {
      console.error('Webhook failed:', response.status)
      return null
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return null
  }
}

// Example 3: Testing webhook endpoint
export async function testWebhookEndpoint() {
  try {
    const response = await engineClient.webhooks['supabase/test'].$get()
    
    if (response.ok) {
      const data = await response.json()
      console.log('Webhook endpoint test:', data)
      return data
    } else {
      console.error('Webhook endpoint test failed:', response.status)
      return null
    }
  } catch (error) {
    console.error('Webhook endpoint test error:', error)
    return null
  }
}

// Example 4: Authentication flow
export async function testAuthentication() {
  try {
    const loginResponse = await engineClient.auth.login.$post({
      json: {
        email: 'admin@example.com',
        password: 'password123',
      },
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('Login successful:', loginData)

      // Use the token for protected routes
      const profileResponse = await engineClient.protected.profile.$get({
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
        },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        console.log('Profile data:', profileData)
        return { login: loginData, profile: profileData }
      } else {
        console.error('Profile fetch failed:', profileResponse.status)
        return { login: loginData, profile: null }
      }
    } else {
      console.error('Login failed:', loginResponse.status)
      return null
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Example 5: Error handling with proper types
export async function testWithErrorHandling() {
  try {
    // Test a non-existent endpoint
    const response = await engineClient.nonexistent.$get()
    
    // This should fail
    if (!response.ok) {
      console.log('Expected error for non-existent endpoint:', response.status)
      return { success: false, status: response.status }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }

  return { success: true }
}
