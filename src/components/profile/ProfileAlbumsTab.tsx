import { useProfileAlbums } from "@/hooks/useProfileAlbums";
import Spinner from "@/components/ui/Spinner";
import AlbumCard from "@/components/profile/AlbumCard";

interface ProfileAlbumsTabProps {
  userId: number;
}

const ProfileAlbumsTab = ({ userId }: ProfileAlbumsTabProps) => {
  const { albums, isLoading, isError } = useProfileAlbums(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        Gagal memuat daftar album.
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        Belum ada album.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
};

export default ProfileAlbumsTab;
