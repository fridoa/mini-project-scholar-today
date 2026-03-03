import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const postService = {
  getAllPosts: (page?: number, limit?: number) => {
    const query = page ? `?_page=${page}&_limit=${limit || 10}` : "";
    return instance.get(`${endpoint.POSTS}${query}`);
  },

  getPostById: (id: number | string) => instance.get(`${endpoint.POSTS}/${id}`),

  getPostsByUserId: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/posts`),

  getCommentsByPostId: (postId: number) =>
    instance.get(`${endpoint.POSTS}/${postId}/comments`),

  createPost: (data: {
    userId: number;
    title: string;
    body: string;
    image?: string;
    imageFileId?: string;
  }) => instance.post(endpoint.POSTS, data),

  deletePost: (id: string) => instance.delete(`${endpoint.POSTS}/${id}`),
};

export default postService;
