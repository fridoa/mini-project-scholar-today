import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const likeService = {
  toggle: (postId: string | number, userId: number) =>
    instance.post(`${endpoint.POSTS}/${postId}/like`, { userId }),

  getStatus: (postId: string | number, userId: number) =>
    instance.get(`${endpoint.POSTS}/${postId}/like`, { params: { userId } }),

  getBatchCounts: (postIds: (string | number)[], userId?: number) =>
    instance.post(`${endpoint.POSTS}/likes/batch`, {
      postIds: postIds.map(String),
      userId,
    }),
};

export default likeService;
