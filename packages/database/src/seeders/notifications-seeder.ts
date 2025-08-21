import { faker } from "@faker-js/faker";
import { createNotification } from "../queries/notifications";
import { getOrganizationsByOwnerId } from "../queries/organizations";
import { getPostsByUserId } from "../queries/posts";
import { getAllUsers } from "../queries/users";
import { BaseSeeder } from "./base-seeder";

export class NotificationsSeeder extends BaseSeeder {
  name = "notifications";
  description = "Seed notifications with various types and content";

  async run() {
    console.log("🌱 Seeding notifications...");

    const users = await getAllUsers();

    // Get organizations and posts for all users
    const allOrganizations = [];
    const allPosts = [];

    for (const user of users) {
      const userOrganizations = await getOrganizationsByOwnerId(user.id);
      const userPosts = await getPostsByUserId(user.id);
      allOrganizations.push(...userOrganizations);
      allPosts.push(...userPosts);
    }

    if (users.length === 0) {
      console.log("⚠️  No users found. Skipping notifications seeding.");
      return;
    }

    const notificationTypes = [
      "info",
      "success",
      "warning",
      "error",
      "invite",
      "mention",
    ];

    const notificationTemplates = [
      {
        type: "info",
        titles: [
          "System Update",
          "New Feature Available",
          "Maintenance Notice",
          "Welcome to the Platform",
        ],
        messages: [
          "A new system update is available. Please check the changelog for details.",
          "We've added new features to improve your experience.",
          "Scheduled maintenance will occur tonight at 2 AM UTC.",
          "Welcome! We're excited to have you on board.",
        ],
      },
      {
        type: "success",
        titles: [
          "Action Completed",
          "Successfully Updated",
          "Welcome Email Sent",
          "Profile Updated",
        ],
        messages: [
          "Your action has been completed successfully.",
          "Your profile has been updated successfully.",
          "Welcome email has been sent to your inbox.",
          "Your profile information has been saved.",
        ],
      },
      {
        type: "warning",
        titles: [
          "Storage Space Low",
          "Password Expiring Soon",
          "Unusual Activity Detected",
          "Backup Required",
        ],
        messages: [
          "Your storage space is running low. Consider cleaning up old files.",
          "Your password will expire in 7 days. Please update it soon.",
          "We detected unusual activity on your account.",
          "It's been a while since your last backup. Consider backing up your data.",
        ],
      },
      {
        type: "error",
        titles: [
          "Login Failed",
          "Payment Declined",
          "Connection Error",
          "Upload Failed",
        ],
        messages: [
          "Your login attempt failed. Please check your credentials.",
          "Your payment was declined. Please update your payment method.",
          "Connection error occurred. Please try again.",
          "File upload failed. Please check your file size and try again.",
        ],
      },
      {
        type: "invite",
        titles: [
          "Organization Invitation",
          "Team Invite",
          "Project Collaboration",
          "Workspace Invitation",
        ],
        messages: [
          "You have been invited to join an organization.",
          "You have been invited to join a team.",
          "You have been invited to collaborate on a project.",
          "You have been invited to join a workspace.",
        ],
      },
      {
        type: "mention",
        titles: [
          "You were mentioned",
          "Comment Reply",
          "Tagged in Post",
          "Mentioned in Discussion",
        ],
        messages: [
          "Someone mentioned you in a post.",
          "Someone replied to your comment.",
          "You were tagged in a post.",
          "You were mentioned in a discussion.",
        ],
      },
    ];

    const notificationsToCreate = [];

    // Create notifications for each user
    for (const user of users) {
      // Create 5-15 notifications per user
      const notificationCount = faker.number.int({ min: 5, max: 15 });

      for (let i = 0; i < notificationCount; i++) {
        const template = faker.helpers.arrayElement(notificationTemplates);
        const title = faker.helpers.arrayElement(template.titles);
        const message = faker.helpers.arrayElement(template.messages);

        // Randomly add organization or post reference
        let organizationId = undefined;
        let postId = undefined;

        if (template.type === "invite" && allOrganizations.length > 0) {
          organizationId = faker.helpers.arrayElement(allOrganizations).id;
        } else if (template.type === "mention" && allPosts.length > 0) {
          postId = faker.helpers.arrayElement(allPosts).id;
        }

        // Randomly mark some as read
        const isRead = faker.datatype.boolean({ probability: 0.3 });
        const isArchived = faker.datatype.boolean({ probability: 0.1 });

        // Create notification with random date in the last 30 days
        const createdAt = faker.date.recent({ days: 30 });

        notificationsToCreate.push({
          userId: user.id,
          title,
          message,
          type: template.type,
          organizationId,
          postId,
          metadata: {
            source: faker.helpers.arrayElement([
              "system",
              "user",
              "organization",
            ]),
            priority: faker.helpers.arrayElement(["low", "medium", "high"]),
          },
          isRead,
          isArchived,
          createdAt,
          updatedAt: createdAt,
          readAt: isRead
            ? faker.date.between({ from: createdAt, to: new Date() })
            : null,
        });
      }
    }

    // Insert notifications in batches
    const batchSize = 50;
    for (let i = 0; i < notificationsToCreate.length; i += batchSize) {
      const batch = notificationsToCreate.slice(i, i + batchSize);

      for (const notification of batch) {
        try {
          await createNotification({
            userId: notification.userId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            organizationId: notification.organizationId,
            postId: notification.postId,
            metadata: notification.metadata,
          });
        } catch (error) {
          console.error("Failed to create notification:", error);
        }
      }
    }

    console.log(`✅ Created ${notificationsToCreate.length} notifications`);
  }
}
