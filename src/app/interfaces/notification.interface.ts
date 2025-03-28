export interface Notification {
  _id: string;
  userId?: string;
  userRole: 'client' | 'manager' | 'admin';
  message: string;
  notificationType: 'client-specific' | 'manager-specific' | 'broadcast' | 'user-specific';
  read: boolean;
  metadata?: {
    link?: string;
    entityId?: string;
    entityType?: string;
    [key: string]: any;
  };
  createdAt: Date;
}
