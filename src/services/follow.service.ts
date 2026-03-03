import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const followService = {
  toggle: (targetUserId: number, currentUserId: number) =>
    instance.post(`${endpoint.USERS}/${targetUserId}/follow`, {
      userId: currentUserId,
    }),

  getInfo: (targetUserId: number, currentUserId: number) =>
    instance.get(`${endpoint.USERS}/${targetUserId}/follow`, {
      params: { userId: currentUserId },
    }),

  getBatch: (userIds: number[], currentUserId: number) =>
    instance.post(`${endpoint.USERS}/follow/batch`, {
      userIds,
      userId: currentUserId,
    }),

  getFollowers: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/followers`),

  getFriends: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/friends`),
};

export default followService;
