import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { notifications, organizations, posts } from '../schema';

export async function getNotificationsByUserId(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    includeRead?: boolean;
    includeArchived?: boolean;
  } = {}
) {
  const { limit = 20, offset = 0, includeRead = true, includeArchived = false } = options;

  const conditions = [eq(notifications.userId, userId)];
  
  if (!includeRead) {
    conditions.push(eq(notifications.isRead, false));
  }
  
  if (!includeArchived) {
    conditions.push(eq(notifications.isArchived, false));
  }

  return await db
    .select({
      id: notifications.id,
      title: notifications.title,
      message: notifications.message,
      type: notifications.type,
      isRead: notifications.isRead,
      isArchived: notifications.isArchived,
      createdAt: notifications.createdAt,
      updatedAt: notifications.updatedAt,
      readAt: notifications.readAt,
      metadata: notifications.metadata,
      organization: {
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
      },
      post: {
        id: posts.id,
        title: posts.title,
      },
    })
    .from(notifications)
    .leftJoin(organizations, eq(notifications.organizationId, organizations.id))
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUnreadNotificationsCount(userId: string) {
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
        eq(notifications.isArchived, false)
      )
    );
  
  return result[0]?.count || 0;
}

export async function getNotificationById(notificationId: string) {
  const result = await db
    .select({
      id: notifications.id,
      title: notifications.title,
      message: notifications.message,
      type: notifications.type,
      isRead: notifications.isRead,
      isArchived: notifications.isArchived,
      createdAt: notifications.createdAt,
      updatedAt: notifications.updatedAt,
      readAt: notifications.readAt,
      metadata: notifications.metadata,
      organization: {
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
      },
      post: {
        id: posts.id,
        title: posts.title,
      },
    })
    .from(notifications)
    .leftJoin(organizations, eq(notifications.organizationId, organizations.id))
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .where(eq(notifications.id, notificationId))
    .limit(1);

  return result[0] || null;
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  return await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
}

export async function markNotificationAsUnread(notificationId: string, userId: string) {
  return await db
    .update(notifications)
    .set({
      isRead: false,
      readAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
}

export async function markAllNotificationsAsRead(userId: string) {
  return await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false),
        eq(notifications.isArchived, false)
      )
    )
    .returning();
}

export async function archiveNotification(notificationId: string, userId: string) {
  return await db
    .update(notifications)
    .set({
      isArchived: true,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
}

export async function unarchiveNotification(notificationId: string, userId: string) {
  return await db
    .update(notifications)
    .set({
      isArchived: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
}

export async function deleteNotification(notificationId: string, userId: string) {
  return await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type: string;
  organizationId?: string;
  postId?: string;
  metadata?: any;
}) {
  return await db
    .insert(notifications)
    .values({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      organizationId: data.organizationId,
      postId: data.postId,
      metadata: data.metadata,
    })
    .returning();
}
