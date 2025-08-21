import { AuthProvider } from '@v1/auth/components'
import { createReactAuthProvider } from '@v1/auth/providers/supabase'
import '@v1/ui/globals.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme'
import { AppRoutes } from './router'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const authProvider = createReactAuthProvider()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider provider={authProvider}>
            <ThemeProvider>
              <AppRoutes />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  </React.StrictMode>,
)
