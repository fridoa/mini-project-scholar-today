import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const notificationService = {
  getByUser: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/notifications`),

  markAsRead: (notificationId: string) =>
    instance.put(`${endpoint.NOTIFICATIONS}/${notificationId}/read`),

  markAllRead: (userId: number) =>
    instance.put(`${endpoint.USERS}/${userId}/notifications/read-all`),
};

export default notificationService;
