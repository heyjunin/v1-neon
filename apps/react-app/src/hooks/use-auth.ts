// Hook de autenticação temporário enquanto resolvemos o problema do StackAuth
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    signInWithOAuth: (provider: string) => {
      console.log(`Sign in with ${provider} - StackAuth temporariamente desabilitado`)
    },
    signOut: () => {
      console.log('Sign out - StackAuth temporariamente desabilitado')
    },
  }
}
