import { TRPCError } from '@trpc/server';
import {
  archiveNotification,
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationAsUnread,
  unarchiveNotification,
} from '@v1/database/queries';
import { z } from 'zod';
import { protectedProcedure, router } from '../context';

const notificationFiltersSchema = z.object({
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  includeRead: z.boolean().optional(),
  includeArchived: z.boolean().optional(),
});

export const notificationsRouter = router({
  // Get notifications for current user
  getNotifications: protectedProcedure
    .input(notificationFiltersSchema)
    .query(async ({ input, ctx }) => {
      try {
        const notifications = await getNotificationsByUserId(ctx.user.id, input);
        return { notifications };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch notifications',
        });
      }
    }),

  // Get unread notifications count
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const count = await getUnreadNotificationsCount(ctx.user.id);
        return { count };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch unread count',
        });
      }
    }),

  // Get single notification by ID
  getNotification: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        const notification = await getNotificationById(input.id);
        
        if (!notification) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        // Check if user owns this notification
        if (notification.id !== input.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied',
          });
        }

        return { notification };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch notification',
        });
      }
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await markNotificationAsRead(input.id, ctx.user.id);
        
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        return { success: true, notification: result[0] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark notification as read',
        });
      }
    }),

  // Mark notification as unread
  markAsUnread: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await markNotificationAsUnread(input.id, ctx.user.id);
        
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        return { success: true, notification: result[0] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark notification as unread',
        });
      }
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        const result = await markAllNotificationsAsRead(ctx.user.id);
        return { success: true, count: result.length };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark all notifications as read',
        });
      }
    }),

  // Archive notification
  archive: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await archiveNotification(input.id, ctx.user.id);
        
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        return { success: true, notification: result[0] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to archive notification',
        });
      }
    }),

  // Unarchive notification
  unarchive: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await unarchiveNotification(input.id, ctx.user.id);
        
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        return { success: true, notification: result[0] };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to unarchive notification',
        });
      }
    }),

  // Delete notification
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await deleteNotification(input.id, ctx.user.id);
        
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Notification not found',
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete notification',
        });
      }
    }),

  // Create notification (for internal use)
  create: protectedProcedure
    .input(z.object({
      userId: z.string().uuid(),
      title: z.string().min(1),
      message: z.string().min(1),
      type: z.string().min(1),
      organizationId: z.string().uuid().optional(),
      postId: z.string().uuid().optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await createNotification(input);
        return { success: true, notification: result[0] };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create notification',
        });
      }
    }),
});
