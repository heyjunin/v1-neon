// Navigation Types
export interface NavigationItem {
  path: string
  label: string
  icon: string
  badge?: string | number
  disabled?: boolean
  children?: NavigationItem[]
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

// PWA Types
export interface PWAState {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  deferredPrompt: any
}

// Page Types
export interface PageMeta {
  title: string
  description?: string
  keywords?: string[]
  ogImage?: string
}

export interface PageProps {
  meta?: PageMeta
  children?: React.ReactNode
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  showFooter?: boolean
  showSidebar?: boolean
}

// Component Base Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

// Error Types
export interface ErrorInfo {
  message: string
  stack?: string
  componentStack?: string
}

// Dev Tools Types (apenas em desenvolvimento)
export interface DevToolsInfo {
  renderCount: number
  lastRender: Date
  props: Record<string, any>
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

// Form Types (para futuras implementações)
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: any) => string | null
  }
}

export interface FormState<T = Record<string, any>> {
  values: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  isSubmitting: boolean
  isValid: boolean
}
