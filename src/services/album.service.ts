import instance from "@/lib/axios/instance";
import type { IAlbum } from "@/types/album.type";
import type { IPhoto } from "@/types/photo.type";

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getAlbumsByUserId = (userId: number) => {
  return instance.get<ApiResponse<IAlbum[]>>(`/users/${userId}/albums`);
};

export const getAlbumPhotos = (albumId: number, limit?: number) => {
  const url = limit 
    ? `/albums/${albumId}/photos?_limit=${limit}`
    : `/albums/${albumId}/photos`;
  return instance.get<ApiResponse<IPhoto[]>>(url);
};

export const getAlbumById = (albumId: number) => {
  return instance.get<ApiResponse<IAlbum>>(`/albums/${albumId}`);
};

export default {
  getAlbumsByUserId,
  getAlbumPhotos,
  getAlbumById,
};
