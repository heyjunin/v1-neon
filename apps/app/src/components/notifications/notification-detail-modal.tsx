"use client";

import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Separator } from "@v1/ui/separator";
import { formatDate, formatRelativeDate } from "@v1/utils";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NotificationDetailModalProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    organization?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    post?: {
      id: string;
      title: string;
    } | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}: NotificationDetailModalProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "invite":
        return "📨";
      case "mention":
        return "👤";
      default:
        return "ℹ️";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      case "invite":
        return "Invitation";
      case "mention":
        return "Mention";
      default:
        return "Information";
    }
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left">
                {notification.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(notification.type)}
                </Badge>
                {!notification.isRead && (
                  <Badge variant="default" className="text-xs">
                    Unread
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Received:</span>
              <span>
                                    {formatRelativeDate(notification.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
                              <span>{formatDate(notification.createdAt, { includeTime: true })}</span>
            </div>
          </div>

          {(notification.organization || notification.post) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Related Content</h4>
                {notification.organization && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">Organization</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.organization.name}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/organizations/${notification.organization.slug}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                )}
                {notification.post && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="text-sm font-medium">Post</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.post.title}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/posts/${notification.post.id}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {!notification.isRead && (
            <Button onClick={handleMarkAsRead} size="sm">
              <Check className="h-4 w-4 mr-1" />
              Mark as read
            </Button>
          )}
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
