import { useQuery } from "@tanstack/react-query";
import albumService from "@/services/album.service";
import type { IAlbum } from "@/types/album.type";

export const useProfileFeaturedPhotos = (userId: number) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "albums", "featured", userId],
    queryFn: () => albumService.getAlbumsByUserId(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const albums: IAlbum[] = response?.data?.data || [];
  const featuredAlbums = albums.slice(0, 3);

  return {
    featuredAlbums,
    isLoading,
    isError,
    hasAlbums: albums.length > 0,
  };
};
