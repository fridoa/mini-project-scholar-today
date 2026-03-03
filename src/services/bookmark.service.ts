import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const bookmarkService = {
  toggle: (postId: string | number, userId: number) =>
    instance.post(`${endpoint.POSTS}/${postId}/bookmark`, { userId }),

  getStatus: (postId: string | number, userId: number) =>
    instance.get(`${endpoint.POSTS}/${postId}/bookmark`, { params: { userId } }),

  getBatchStatus: (postIds: (string | number)[], userId: number) =>
    instance.post(`${endpoint.POSTS}/bookmarks/batch`, {
      postIds: postIds.map(String),
      userId,
    }),

  getBookmarkedPosts: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/bookmarks`),
};

export default bookmarkService;
