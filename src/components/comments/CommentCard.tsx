import React from "react";
import type { IComment } from "@/types/post.type";

interface CommentCardProps {
  comment: IComment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex font-semibold h-8 w-8 items-center justify-center rounded-full bg-[#fdeee7] text-xs text-[#ec5b13]">
          {comment.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 capitalize">
            {comment.name}
          </p>
          <p className="text-xs text-gray-400">{comment.email}</p>
        </div>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
        {comment.body}
      </p>
    </div>
  );
};

export default React.memo(CommentCard);
