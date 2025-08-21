'use client';

import { trpc } from './client';

// Posts hooks
export const usePosts = (options?: {
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}) => {
  return trpc.posts.getPosts.useQuery(options || {}, {
    refetchOnWindowFocus: false,
  });
};

export const usePost = (id: string) => {
  return trpc.posts.getPostById.useQuery({ id }, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const usePostsByUser = (userId: string) => {
  return trpc.posts.getPostsByUserId.useQuery({ userId }, {
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePost = () => {
  return trpc.posts.createPost.useMutation();
};

export const useUpdatePost = () => {
  return trpc.posts.updatePost.useMutation();
};

export const useDeletePost = () => {
  return trpc.posts.deletePost.useMutation();
};

// Organizations hooks
export const useOrganizations = (options?: {
  search?: string;
  page?: number;
  limit?: number;
  ownerId?: string;
  memberId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}) => {
  return trpc.organizations.getOrganizations.useQuery(options || {}, {
    refetchOnWindowFocus: false,
  });
};

export const useOrganization = (id: string) => {
  return trpc.organizations.getOrganizationById.useQuery({ id }, {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationBySlug = (slug: string) => {
  return trpc.organizations.getOrganizationBySlug.useQuery({ slug }, {
    enabled: !!slug,
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationsByOwner = (ownerId: string) => {
  return trpc.organizations.getOrganizationsByOwnerId.useQuery({ ownerId }, {
    enabled: !!ownerId,
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationsByMember = (memberId: string) => {
  return trpc.organizations.getOrganizationsByMemberId.useQuery({ memberId }, {
    enabled: !!memberId,
    refetchOnWindowFocus: false,
  });
};

export const useUserOrganizations = () => {
  return trpc.organizations.getUserOrganizations.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationMembers = (organizationId: string) => {
  return trpc.organizations.getOrganizationMembers.useQuery({ id: organizationId }, {
    enabled: !!organizationId,
    refetchOnWindowFocus: false,
  });
};

export const useOrganizationInvites = (organizationId: string) => {
  return trpc.organizations.getOrganizationInvites.useQuery({ id: organizationId }, {
    enabled: !!organizationId,
    refetchOnWindowFocus: false,
  });
};

export const usePendingInvitesByEmail = (email: string) => {
  return trpc.organizations.getPendingInvitesByEmail.useQuery({ email }, {
    enabled: !!email,
    refetchOnWindowFocus: false,
  });
};

export const useInviteByToken = (token: string) => {
  return trpc.organizations.getInviteByToken.useQuery({ token }, {
    enabled: !!token,
    refetchOnWindowFocus: false,
  });
};

// Organization mutations
export const useCreateOrganization = () => {
  return trpc.organizations.createOrganization.useMutation();
};

export const useUpdateOrganization = () => {
  return trpc.organizations.updateOrganization.useMutation();
};

export const useDeleteOrganization = () => {
  return trpc.organizations.deleteOrganization.useMutation();
};

export const useDeactivateOrganization = () => {
  return trpc.organizations.deactivateOrganization.useMutation();
};

export const useActivateOrganization = () => {
  return trpc.organizations.activateOrganization.useMutation();
};

// Member mutations
export const useAddMember = () => {
  return trpc.organizations.addMember.useMutation();
};

export const useUpdateMemberRole = () => {
  return trpc.organizations.updateMemberRole.useMutation();
};

export const useRemoveMember = () => {
  return trpc.organizations.removeMember.useMutation();
};

export const useSuspendMember = () => {
  return trpc.organizations.suspendMember.useMutation();
};

export const useActivateMember = () => {
  return trpc.organizations.activateMember.useMutation();
};

// Invite mutations
export const useCreateInvite = () => {
  return trpc.organizations.createInvite.useMutation();
};

export const useAcceptInvite = () => {
  return trpc.organizations.acceptInvite.useMutation();
};

export const useCancelInvite = () => {
  return trpc.organizations.cancelInvite.useMutation();
};

export const useResendInvite = () => {
  return trpc.organizations.resendInvite.useMutation();
};

// Utility mutations
export const useTransferOwnership = () => {
  return trpc.organizations.transferOwnership.useMutation();
};

export const useBulkAddMembers = () => {
  return trpc.organizations.bulkAddMembers.useMutation();
};

// Auth hooks
export const useSignUp = () => {
  return trpc.auth.signUp.useMutation();
};

export const useSignIn = () => {
  return trpc.auth.signIn.useMutation();
};

export const useSignOut = () => {
  return trpc.auth.signOut.useMutation();
};

export const useResetPassword = () => {
  return trpc.auth.resetPassword.useMutation();
};

export const useUpdatePassword = () => {
  return trpc.auth.updatePassword.useMutation();
};

export const useGetCurrentUser = () => {
  return trpc.auth.getCurrentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
};

export const useIsAuthenticated = () => {
  return trpc.auth.isAuthenticated.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
};

export const useSendMagicLink = () => {
  return trpc.auth.sendMagicLink.useMutation();
};

export const useSendOtp = () => {
  return trpc.auth.sendOtp.useMutation();
};

export const useVerifyOtp = () => {
  return trpc.auth.verifyOtp.useMutation();
};

export const useUpdateProfile = () => {
  return trpc.auth.updateProfile.useMutation();
};

export const useChangePassword = () => {
  return trpc.auth.changePassword.useMutation();
};

export const useDeleteAccount = () => {
  return trpc.auth.deleteAccount.useMutation();
};
