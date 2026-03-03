import { MdWork, MdHome, MdLanguage, MdEmail, MdPhone } from "react-icons/md";
import type { IUser } from "@/types/user.type";
import type { IAlbum } from "@/types/album.type";
import Card from "@/components/ui/Card";
import { getPhotoUrl } from "@/utils/image";
import { Link } from "react-router";
import { useProfileFeaturedPhotos } from "@/hooks/useProfileFeaturedPhotos";

interface ProfileIntroProps {
  profile: IUser;
  isOwnProfile?: boolean;
}

const ProfileIntro = ({ profile, isOwnProfile = false }: ProfileIntroProps) => {
  const { featuredAlbums, isLoading, hasAlbums } = useProfileFeaturedPhotos(
    profile.id,
  );

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Personal Information
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-gray-700">
          <MdWork size={24} className="text-gray-400" />
          <p className="text-[15px]">
            Works at <span className="font-bold">{profile.company.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MdHome size={24} className="text-gray-400" />
          <p className="text-[15px]">
            Lives in <span className="font-bold">{profile.address.city}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MdLanguage size={24} className="text-gray-400" />
          <a
            href={`https://${profile.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-[15px] font-bold text-[#ec5b13] hover:underline"
          >
            {profile.website}
          </a>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MdEmail size={24} className="text-gray-400" />
          <p className="truncate text-[15px]">{profile.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-700">
        <MdPhone size={24} className="text-gray-400" />
        <p className="truncate text-[15px]">{profile.phone}</p>
      </div>

      {isOwnProfile && (
        <button className="mt-2 w-full rounded-lg bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
          Edit details
        </button>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
        <h3 className="text-[15px] font-bold text-gray-900">Sorotan</h3>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 w-32 shrink-0 animate-pulse rounded-xl border-2 border-white bg-gray-200 shadow-sm"
              />
            ))
          ) : featuredAlbums.length > 0 ? (
            featuredAlbums.map((album: IAlbum) => (
              <Link
                key={album.id}
                to={`/users/${profile.id}/albums/${album.id}`}
                className="group relative h-44 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <img
                  src={getPhotoUrl(album.id * 1000, "preview")}
                  alt={album.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))
          ) : (
            <div className="flex h-44 w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-xs text-gray-400">
              {hasAlbums
                ? "Belum ada foto pilihan"
                : "Belum ada konten sorotan"}
            </div>
          )}
        </div>
        {isOwnProfile && (
          <button className="w-full rounded-lg bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">
            Edit featured
          </button>
        )}
      </div>
    </Card>
  );
};

export default ProfileIntro;
