import { logger } from "@v1/logger";
import type { AuthProvider, AuthSession, AuthUser, SignInOptions } from "../../types";

export class SupabaseAuthProvider implements AuthProvider {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async signIn(provider: string, options?: SignInOptions): Promise<void> {
    try {
      const { error } = await this.client.auth.signInWithOAuth({
        provider: provider as "google" | "discord" | "github",
        options: {
          redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
          scopes: options?.scopes,
        },
      });

      if (error) {
        logger.error("Sign in error:", error);
        throw error;
      }
    } catch (error) {
      logger.error("Sign in error:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        logger.error("Sign out error:", error);
        throw error;
      }
    } catch (error) {
      logger.error("Sign out error:", error);
      throw error;
    }
  }

  async getUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.client.auth.getUser();
      
      if (error) {
        logger.error("Get user error:", error);
        return null;
      }

      if (!user) return null;

      return {
        id: user.id,
        email: user.email || "",
        fullName: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at || user.created_at),
      };
    } catch (error) {
      logger.error("Get user error:", error);
      return null;
    }
  }

  async getSession(): Promise<AuthSession> {
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      
      if (error) {
        logger.error("Get session error:", error);
        return {
          user: null,
          isLoading: false,
          error: error as Error,
        };
      }

      if (!session?.user) {
        return {
          user: null,
          isLoading: false,
          error: null,
        };
      }

      const user: AuthUser = {
        id: session.user.id,
        email: session.user.email || "",
        fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        avatarUrl: session.user.user_metadata?.avatar_url,
        createdAt: new Date(session.user.created_at),
        updatedAt: new Date(session.user.updated_at || session.user.created_at),
      };

      return {
        user,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      logger.error("Get session error:", error);
      return {
        user: null,
        isLoading: false,
        error: error as Error,
      };
    }
  }

  onAuthStateChange(callback: (session: AuthSession) => void): () => void {
    const { data: { subscription } } = this.client.auth.onAuthStateChange(
      async (event: string) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const authSession = await this.getSession();
          callback(authSession);
        } else if (event === "SIGNED_OUT") {
          callback({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }
}
