import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
// Storage utilities with type safety

// Utility para classes CSS (muito usado em componentes)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Storage utilities com type safety
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }
}

// URL utilities
export const url = {
  // Constrói URLs de forma segura
  build: (base: string, ...segments: string[]): string => {
    const cleanBase = base.replace(/\/+$/, '')
    const cleanSegments = segments.map(s => s.replace(/^\/+|\/+$/g, ''))
    return [cleanBase, ...cleanSegments].join('/')
  },
  
  // Adiciona query parameters
  withParams: (url: string, params: Record<string, string | number | boolean>): string => {
    const urlObj = new URL(url, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, String(value))
    })
    return urlObj.pathname + urlObj.search
  }
}

// Date utilities
export const date = {
  format: (date: Date | string, locale = 'pt-BR'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d)
  },
  
  relative: (date: Date | string, locale = 'pt-BR'): string => {
    const d = typeof date === 'string' ? new Date(date) : date
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const now = new Date()
    const diffInSeconds = (d.getTime() - now.getTime()) / 1000
    
    if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second')
    if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute')
    if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
    return rtf.format(Math.round(diffInSeconds / 86400), 'day')
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Sleep utility (útil para testing e delays)
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Generate unique ID
export const generateId = (): string => 
  Math.random().toString(36).substring(2) + Date.now().toString(36)

// Format bytes
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

// Dev utilities (apenas em desenvolvimento)
export const dev = {
  log: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      console.log('[DEV]', ...args)
    }
  },
  
  warn: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      console.warn('[DEV]', ...args)
    }
  },
  
  error: (...args: any[]): void => {
    if (import.meta.env.DEV) {
      console.error('[DEV]', ...args)
    }
  },
  
  time: (label: string): void => {
    if (import.meta.env.DEV) {
      console.time(`[DEV] ${label}`)
    }
  },
  
  timeEnd: (label: string): void => {
    if (import.meta.env.DEV) {
      console.timeEnd(`[DEV] ${label}`)
    }
  }
}
