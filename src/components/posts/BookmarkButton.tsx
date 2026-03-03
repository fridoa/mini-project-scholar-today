import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { useBookmark } from "@/hooks/useBookmark";

interface BookmarkButtonProps {
  postId: string | number;
  autoFetch?: boolean;
}

const BookmarkButton = ({ postId, autoFetch }: BookmarkButtonProps) => {
  const { bookmarked, toggleBookmark, isToggling } = useBookmark(postId, { autoFetch });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleBookmark();
      }}
      disabled={isToggling}
      className={`cursor-pointer transition-all ${
        bookmarked
          ? "text-[#ec5b13]"
          : "text-gray-400 hover:text-[#ec5b13]"
      }`}
    >
      {bookmarked ? (
        <MdBookmark size={20} />
      ) : (
        <MdBookmarkBorder size={20} />
      )}
    </button>
  );
};

export default BookmarkButton;
