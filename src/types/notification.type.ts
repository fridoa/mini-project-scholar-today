export type NotificationType = "like" | "follow" | "comment";

export interface INotification {
  _id: string;
  userId: number;
  fromUserId: number;
  type: NotificationType;
  postId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
