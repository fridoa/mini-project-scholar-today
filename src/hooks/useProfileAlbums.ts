import { useQuery } from "@tanstack/react-query";
import albumService from "@/services/album.service";
import type { IAlbum } from "@/types/album.type";

export const useProfileAlbums = (userId: number) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", "albums", userId],
    queryFn: () => albumService.getAlbumsByUserId(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, 
  });

  const albums: IAlbum[] = response?.data?.data || [];

  return {
    albums,
    isLoading,
    isError,
  };
};
