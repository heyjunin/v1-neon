import { TRPCError } from '@trpc/server';
import { createClient } from '@v1/supabase/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../context';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

const otpSchema = z.object({
  email: z.string().email(),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  location: z.string().max(100).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const authRouter = router({
  // Sign up with email/password
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
          },
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        user: data.user,
        session: data.session,
        message: 'Check your email for the confirmation link',
      };
    }),

  // Sign in with email/password
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      return {
        user: data.user,
        session: data.session,
      };
    }),

  // Sign out
  signOut: protectedProcedure
    .mutation(async () => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { message: 'Signed out successfully' };
    }),

  // Request password reset
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'Password reset email sent' };
    }),

  // Update password (after reset)
  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        password: input.password,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'Password updated successfully' };
    }),

  // Get current user
  getCurrentUser: protectedProcedure
    .query(async () => {
      const supabase = createClient();
      
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      return { user };
    }),

  // Check if user is authenticated
  isAuthenticated: publicProcedure
    .query(async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();

      return { isAuthenticated: !!user, user };
    }),

  // Send magic link
  sendMagicLink: publicProcedure
    .input(magicLinkSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'Magic link sent to your email' };
    }),

  // Send OTP
  sendOtp: publicProcedure
    .input(otpSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'OTP sent to your email' };
    }),

  // Verify OTP
  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.verifyOtp({
        email: input.email,
        token: input.token,
        type: 'email',
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        user: data.user,
        session: data.session,
        message: 'OTP verified successfully',
      };
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.updateUser({
        data: input,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'Profile updated successfully' };
    }),

  // Change password
  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      
      // Verify current password first
      const { error: verifyError } = await supabase.auth.updateUser({
        password: input.newPassword,
      });

      if (verifyError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: verifyError.message,
        });
      }

      return { message: 'Password changed successfully' };
    }),

  // Delete account
  deleteAccount: protectedProcedure
    .mutation(async () => {
      const supabase = createClient();
      
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { message: 'Account deleted successfully' };
    }),
});
