import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useLike } from "@/hooks/useLike";

interface LikeButtonProps {
  postId: string | number;
  autoFetch?: boolean;
}

const LikeButton = ({ postId, autoFetch }: LikeButtonProps) => {
  const { liked, count, toggleLike, isToggling } = useLike(postId, { autoFetch });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleLike();
      }}
      disabled={isToggling}
      className={`flex cursor-pointer items-center gap-1.5 text-sm transition-all ${
        liked
          ? "text-red-500"
          : "text-gray-400 hover:text-red-400"
      }`}
    >
      {liked ? (
        <MdFavorite size={18} className="transition-transform duration-200 animate-[bounce-in_0.3s_ease]" />
      ) : (
        <MdFavoriteBorder size={18} />
      )}
      {count > 0 && <span className="text-xs font-medium">{count}</span>}
    </button>
  );
};

export default LikeButton;
