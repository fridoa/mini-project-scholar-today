import { useQuery } from "@tanstack/react-query";
import albumService from "@/services/album.service";

export const useAlbumDetail = (userId: number, albumId: number) => {
  const {
    data: albumsResponse,
    isLoading: isLoadingAlbum,
    isError: isErrorAlbum,
  } = useQuery({
    queryKey: ["user", "albums", userId],
    queryFn: () => albumService.getAlbumsByUserId(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: photosResponse,
    isLoading: isLoadingPhotos,
    isError: isErrorPhotos,
  } = useQuery({
    queryKey: ["album", "photos", albumId],
    queryFn: () => albumService.getAlbumPhotos(albumId),
    enabled: !!albumId,
    staleTime: 10 * 60 * 1000,
  });

  const albums = albumsResponse?.data?.data || [];
  const album = albums.find((a) => a.id === albumId) || null;
  const photos = photosResponse?.data?.data || [];

  return {
    album,
    photos,
    isLoading: isLoadingAlbum || isLoadingPhotos,
    isError: isErrorAlbum || isErrorPhotos,
  };
};
