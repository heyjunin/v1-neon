
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
}

export interface AuthContextValue extends AuthSession {
  signIn: (provider: string, options?: SignInOptions) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface SignInOptions {
  redirectTo?: string;
  scopes?: string;
}

export interface AuthProvider {
  signIn: (provider: string, options?: SignInOptions) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<AuthUser | null>;
  getSession: () => Promise<AuthSession>;
  onAuthStateChange: (callback: (session: AuthSession) => void) => () => void;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  provider: AuthProvider;
}
