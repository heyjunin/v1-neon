// App Configuration
export const APP_CONFIG = {
  name: 'V1 React App',
  shortName: 'V1 React',
  description: 'Aplicação React opinativa com React Router v6 e design system V1',
  version: '1.0.0',
  author: 'V1 Team',
} as const

// Navigation Configuration
export const NAVIGATION = {
  items: [
    { path: '/', label: 'Home', icon: 'Home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { path: '/posts', label: 'Posts', icon: 'FileText' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/pwa', label: 'PWA', icon: 'Globe' },
  ],
} as const

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: 'light',
  storageKey: 'v1-react-theme',
  transitionDuration: 200,
} as const

// PWA Configuration
export const PWA_CONFIG = {
  updateCheckInterval: 60000, // 1 minute
  offlineMessage: 'Você está offline. Algumas funcionalidades podem estar limitadas.',
  installPromptDelay: 3000, // 3 seconds
} as const

// API Configuration (para futuras implementações)
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  retryAttempts: 3,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: THEME_CONFIG.storageKey,
  userPreferences: 'v1-react-user-prefs',
  lastVisitedPage: 'v1-react-last-page',
} as const

// Feature Flags (para controle de features)
export const FEATURE_FLAGS = {
  enablePWA: true,
  enableThemeToggle: true,
  enableDevTools: import.meta.env.DEV,
  enableAnalytics: false,
} as const
