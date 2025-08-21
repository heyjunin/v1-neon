export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  status: "active" | "invited" | "suspended";
  invitedBy: string | null;
  invitedAt: string | null;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  role: "owner" | "admin" | "member";
  invitedBy: string;
  token: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  acceptedAt: string | null;
  acceptedBy: string | null;
  createdAt: string;
  updatedAt: string;
  invitedByUser?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface OrganizationFormData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}

export interface MemberFormData {
  userId: string;
  role: "owner" | "admin" | "member";
}

export interface InviteFormData {
  email: string;
  role: "owner" | "admin" | "member";
}

// Organization roles and permissions
export type OrganizationRole = "owner" | "admin" | "member";

export interface OrganizationPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  canTransferOwnership: boolean;
}

export const ROLE_PERMISSIONS: Record<
  OrganizationRole,
  OrganizationPermissions
> = {
  owner: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canManageMembers: true,
    canInviteMembers: true,
    canTransferOwnership: true,
  },
  admin: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canManageMembers: true,
    canInviteMembers: true,
    canTransferOwnership: false,
  },
  member: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canManageMembers: false,
    canInviteMembers: false,
    canTransferOwnership: false,
  },
};

export function getOrganizationPermissions(
  role: OrganizationRole,
): OrganizationPermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.member;
}
