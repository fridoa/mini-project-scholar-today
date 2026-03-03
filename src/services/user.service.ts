import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const userService = {
  getAllUsers: () => instance.get(endpoint.USERS),

  getUserById: (id: number) => instance.get(`${endpoint.USERS}/${id}`),

  getAlbumsByUserId: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/albums`),

  getPhotosByAlbumId: (albumId: number) =>
    instance.get(`${endpoint.ALBUMS}/${albumId}/photos`),

  getTodosByUserId: (userId: number) =>
    instance.get(`${endpoint.USERS}/${userId}/todos`),
};

export default userService;
