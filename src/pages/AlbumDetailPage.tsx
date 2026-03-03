import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { useAlbumDetail } from "@/hooks/useAlbumDetail";
import Spinner from "@/components/ui/Spinner";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { getPhotoUrl } from "@/utils/image";
import type { IPhoto } from "@/types/photo.type";

const AlbumDetailPage = () => {
  const { userId, albumId } = useParams();
  const navigate = useNavigate();
  const { album, photos, isLoading, isError } = useAlbumDetail(
    Number(userId),
    Number(albumId),
  );
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<IPhoto | null>(null);

  const handleImageLoad = (photoId: number) => {
    setLoadedImages((prev) => ({ ...prev, [photoId]: true }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !album) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
        <p>Gagal memuat detail album atau album tidak ditemukan.</p>
        <button
          onClick={() => navigate(`/users/${userId}`)}
          className="mt-4 text-[#ec5b13] hover:underline"
        >
          Kembali ke Profile
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
        <button
          onClick={() => navigate(`/users/${userId}`)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {album.title}
          </h1>
          <p className="text-sm text-gray-500">
            {photos.length} Photos Collection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo) => {
          const isLoaded = loadedImages[photo.id];

          return (
            <motion.div
              layoutId={`photo-container-${photo.id}`}
              onClick={() => setSelectedPhoto(photo)}
              key={photo.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 shadow-sm"
            >
              {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-200" />
              )}

              <img
                src={getPhotoUrl(photo.id, "detail")}
                alt={photo.title}
                loading="lazy"
                height={150}
                width={150}
                className={`h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-110 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(photo.id)}
                onError={(e) => {
                  e.currentTarget.src = "/fallback.png";
                }}
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/80 to-transparent p-3 text-white transition-transform duration-300 group-hover:translate-y-0">
                <p className="line-clamp-2 text-xs font-medium capitalize">
                  {photo.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <ImageLightbox
        src={selectedPhoto ? getPhotoUrl(selectedPhoto.id, "detail") : ""}
        alt={selectedPhoto?.title || ""}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        layoutId={selectedPhoto ? `photo-container-${selectedPhoto.id}` : undefined}
        caption={selectedPhoto?.title}
      />
    </div>
  );
};

export default AlbumDetailPage;
