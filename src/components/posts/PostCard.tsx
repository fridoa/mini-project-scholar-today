import { memo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { MdComment } from "react-icons/md";
import { getAvatarByUserId } from "@/utils/avatar";
import Card from "@/components/ui/Card";
import ImageLightbox from "@/components/ui/ImageLightbox";
import LikeButton from "@/components/posts/LikeButton";
import BookmarkButton from "@/components/posts/BookmarkButton";
import type { IPost } from "@/types/post.type";
import type { IUser } from "@/types/user.type";

interface PostCardProps {
  post: IPost;
  author?: IUser;
  showFooter?: boolean;
  clickable?: boolean;
}

const PostCard = memo(
  ({ post, author, showFooter = true, clickable = true }: PostCardProps) => {
    const navigate = useNavigate();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      if (textRef.current) {
        setIsTruncated(
          textRef.current.scrollHeight > textRef.current.clientHeight,
        );
      }
    }, [post.body, clickable]);

    const shouldClamp = clickable && !isExpanded;

    return (
      <Card
        className={clickable ? "cursor-pointer" : ""}
        onClick={clickable ? () => navigate(`/posts/${post.id}`) : undefined}
      >
        <Card.Header>
          <img
            src={getAvatarByUserId(post.userId)}
            alt={author?.name || "User"}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p
              className="text-sm font-semibold text-gray-900 hover:text-[#ec5b13]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/users/${post.userId}`);
              }}
            >
              {author?.name || "Unknown User"}
            </p>
            <p className="text-xs text-gray-400">
              @{author?.username || "unknown"}
            </p>
          </div>
        </Card.Header>

        <Card.Body>
          <h2 className="text-base font-semibold text-gray-800 capitalize">
            {post.title}
          </h2>
          <p
            ref={textRef}
            className={`mt-1.5 text-sm leading-relaxed text-gray-500 ${
              shouldClamp ? "line-clamp-2" : ""
            }`}
          >
            {post.body}
          </p>
          {clickable && (isTruncated || isExpanded) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-1 cursor-pointer text-xs font-semibold text-[#ec5b13] hover:underline"
            >
              {isExpanded ? "Show less" : "Show more..."}
            </button>
          )}
          {post.image && (
            <>
              <motion.img
                layoutId={`post-image-${post.id}`}
                src={post.image}
                alt={post.title}
                className="mt-3 max-h-72 w-full cursor-pointer rounded-xl object-cover transition-opacity hover:opacity-90"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
              />
              <ImageLightbox
                src={post.image}
                alt={post.title}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                layoutId={`post-image-${post.id}`}
              />
            </>
          )}
        </Card.Body>

        {showFooter && (
          <Card.Footer className="justify-between">
            <div className="flex items-center gap-4">
              <LikeButton postId={post.id} />
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <MdComment size={16} />
                Comments
              </span>
            </div>
            <BookmarkButton postId={post.id} />
          </Card.Footer>
        )}
      </Card>
    );
  },
);

PostCard.displayName = "PostCard";

export default PostCard;
