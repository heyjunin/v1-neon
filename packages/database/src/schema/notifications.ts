import { pgTable, text, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';
import { posts } from './posts';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'info', 'success', 'warning', 'error', 'invite', 'mention', etc.
  isRead: boolean('is_read').default(false).notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),
  
  // Optional references to related entities
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  
  // Additional data as JSON
  metadata: jsonb('metadata'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
