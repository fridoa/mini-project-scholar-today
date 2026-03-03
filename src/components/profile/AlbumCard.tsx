import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import type { IAlbum } from "@/types/album.type";
import Card from "@/components/ui/Card";
import { getPhotoUrl } from "@/utils/image";

interface AlbumCardProps {
  album: IAlbum;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const handleClick = () => {
    navigate(`/users/${album.userId}/albums/${album.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex cursor-pointer flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        ref={ref}
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-200"
      >
        {(!inView || !isLoaded) && (
          <div className="absolute inset-0 animate-pulse bg-gray-300" />
        )}

        {inView && (
          <img
            src={getPhotoUrl(album.id * 1000, "preview")}
            alt={album.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/fallback.png";
            }}
          />
        )}

        <div
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <Card.Body className="mt-0 flex shrink-0 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-[#fdeee7] px-2 py-1 text-[10px] font-bold tracking-wider text-[#ec5b13] uppercase">
            Album
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg leading-snug font-bold text-gray-900 capitalize">
          {album.title}
        </h3>
        <p className="mt-3 text-sm font-medium text-gray-500">
          View Collection →
        </p>
      </Card.Body>
    </Card>
  );
};

export default AlbumCard;
