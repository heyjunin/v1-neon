'use client';

import { useArchiveNotification, useDeleteNotification, useMarkNotificationAsRead, useMarkNotificationAsUnread, useNotifications, useUnarchiveNotification } from '@/lib/trpc';
import { Badge } from '@v1/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { ScrollArea } from '@v1/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@v1/ui/tabs';
import { Archive, Bell, Check, Filter, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { NotificationDetailModal } from './notification-detail-modal';
import { NotificationItem } from './notification-item';

export function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data: allNotifications, isLoading: isLoadingAll, refetch: refetchAll } = useNotifications({
    limit: 50,
    includeRead: true,
    includeArchived: false,
  });

  const { data: unreadNotifications, isLoading: isLoadingUnread, refetch: refetchUnread } = useNotifications({
    limit: 50,
    includeRead: false,
    includeArchived: false,
  });

  const { data: archivedNotifications, isLoading: isLoadingArchived, refetch: refetchArchived } = useNotifications({
    limit: 50,
    includeRead: true,
    includeArchived: true,
  });

  const markAsRead = useMarkNotificationAsRead();
  const markAsUnread = useMarkNotificationAsUnread();
  const archive = useArchiveNotification();
  const unarchive = useUnarchiveNotification();
  const deleteNotification = useDeleteNotification();

  const getCurrentNotifications = () => {
    switch (selectedTab) {
      case 'unread':
        return unreadNotifications?.notifications || [];
      case 'archived':
        return archivedNotifications?.notifications || [];
      default:
        return allNotifications?.notifications || [];
    }
  };

  const getCurrentLoading = () => {
    switch (selectedTab) {
      case 'unread':
        return isLoadingUnread;
      case 'archived':
        return isLoadingArchived;
      default:
        return isLoadingAll;
    }
  };

  const refetchCurrent = () => {
    switch (selectedTab) {
      case 'unread':
        refetchUnread();
        break;
      case 'archived':
        refetchArchived();
        break;
      default:
        refetchAll();
        break;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync({ id: notificationId });
      refetchCurrent();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAsUnread = async (notificationId: string) => {
    try {
      await markAsUnread.mutateAsync({ id: notificationId });
      refetchCurrent();
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await archive.mutateAsync({ id: notificationId });
      refetchCurrent();
    } catch (error) {
      console.error('Failed to archive notification:', error);
    }
  };

  const handleUnarchive = async (notificationId: string) => {
    try {
      await unarchive.mutateAsync({ id: notificationId });
      refetchCurrent();
    } catch (error) {
      console.error('Failed to unarchive notification:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification.mutateAsync({ id: notificationId });
      refetchCurrent();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleViewDetail = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'invite':
        return '📨';
      case 'mention':
        return '👤';
      default:
        return 'ℹ️';
    }
  };

  const notifications = getCurrentNotifications();
  const isLoading = getCurrentLoading();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Manage your notifications and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              All
              <Badge variant="secondary" className="ml-1">
                {allNotifications?.notifications?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Unread
              <Badge variant="destructive" className="ml-1">
                {unreadNotifications?.notifications?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archived
              <Badge variant="secondary" className="ml-1">
                {archivedNotifications?.notifications?.length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>

                     <TabsContent value="all" className="space-y-4">
             <NotificationsList
               notifications={notifications}
               isLoading={isLoading}
               onMarkAsRead={handleMarkAsRead}
               onMarkAsUnread={handleMarkAsUnread}
               onArchive={handleArchive}
               onUnarchive={handleUnarchive}
               onDelete={handleDelete}
               onViewDetail={handleViewDetail}
               getIcon={getNotificationIcon}
               showActions={true}
               selectedTab={selectedTab}
             />
           </TabsContent>

           <TabsContent value="unread" className="space-y-4">
             <NotificationsList
               notifications={notifications}
               isLoading={isLoading}
               onMarkAsRead={handleMarkAsRead}
               onMarkAsUnread={handleMarkAsUnread}
               onArchive={handleArchive}
               onUnarchive={handleUnarchive}
               onDelete={handleDelete}
               onViewDetail={handleViewDetail}
               getIcon={getNotificationIcon}
               showActions={true}
               selectedTab={selectedTab}
             />
           </TabsContent>

           <TabsContent value="archived" className="space-y-4">
             <NotificationsList
               notifications={notifications}
               isLoading={isLoading}
               onMarkAsRead={handleMarkAsRead}
               onMarkAsUnread={handleMarkAsUnread}
               onArchive={handleArchive}
               onUnarchive={handleUnarchive}
               onDelete={handleDelete}
               onViewDetail={handleViewDetail}
               getIcon={getNotificationIcon}
               showActions={true}
               selectedTab={selectedTab}
             />
           </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedNotification(null);
          }}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}

interface NotificationsListProps {
  notifications: any[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (notification: any) => void;
  getIcon: (type: string) => string;
  showActions: boolean;
  selectedTab: string;
}

function NotificationsList({
  notifications,
  isLoading,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onUnarchive,
  onDelete,
  onViewDetail,
  getIcon,
  showActions,
  selectedTab,
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading notifications...</span>
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground">You're all caught up!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Notifications ({notifications.length})
        </CardTitle>
        <CardDescription>
          {selectedTab === 'unread' && 'Unread notifications'}
          {selectedTab === 'archived' && 'Archived notifications'}
          {selectedTab === 'all' && 'All notifications'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                getIcon={getIcon}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
