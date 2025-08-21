'use client';

import { Button } from '@v1/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@v1/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Check, Eye, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { NotificationDetailModal } from './notification-detail-modal';

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
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
  onMarkAsRead: (id: string) => void;
  getIcon: (type: string) => string;
}

export function NotificationItem({ notification, onMarkAsRead, getIcon }: NotificationItemProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  const handleViewDetail = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <div
        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
          !notification.isRead ? 'bg-accent/50' : ''
        }`}
        onClick={handleViewDetail}
      >
        <div className="flex-shrink-0 text-lg">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${!notification.isRead ? 'font-semibold' : ''}`}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-6 w-6 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewDetail}>
                    <Eye className="h-4 w-4 mr-2" />
                    View details
                  </DropdownMenuItem>
                  {!notification.isRead && (
                    <DropdownMenuItem onClick={handleMarkAsRead}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark as read
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <NotificationDetailModal
        notification={notification}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMarkAsRead={onMarkAsRead}
      />
    </>
  );
}
