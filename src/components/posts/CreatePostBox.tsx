import { useState, useRef } from "react";
import { MdImage, MdClose } from "react-icons/md";
import useAuthStore from "@/stores/useAuthStore";
import { getAvatarByUserId } from "@/utils/avatar";
import { useCreatePost } from "@/hooks/useCreatePost";
import Button from "@/components/ui/Button";

const CreatePostBox = () => {
  const { user } = useAuthStore();
  const { createPost, isLoading } = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image must be less than 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setImageError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;

    createPost(
      { title: title.trim(), body: body.trim(), image: imageFile },
      {
        onSuccess: () => {
          setTitle("");
          setBody("");
          handleRemoveImage();
          setIsExpanded(false);
        },
      },
    );
  };

  const canPost = title.trim().length > 0 && body.trim().length > 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={getAvatarByUserId(user?.id || 1)}
          alt={user?.name || "User"}
          className="h-10 w-10 rounded-full object-cover"
        />

        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 cursor-pointer rounded-full border border-gray-200 px-4 py-2.5 text-left text-sm text-gray-400 transition-colors hover:bg-gray-50"
          >
            What's on your mind, {user?.name?.split(" ")[0] || "User"}?
          </button>
        ) : (
          <div className="flex-1 space-y-3">
            <input
              type="text"
              name="post-title"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base font-semibold text-gray-900 outline-none placeholder:text-gray-300"
              autoFocus
            />
            <textarea
              name="post-body"
              placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "User"}?`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="w-full resize-none text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
          </div>
        )}
      </div>

      {imageError && (
        <p className="mt-3 text-xs font-medium text-red-500">{imageError}</p>
      )}

      {imagePreview && (
        <div className="relative mt-3">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-64 w-full rounded-xl object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
          >
            <MdClose size={18} />
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            name="post-image"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-[#ec5b13]"
          >
            <MdImage size={18} />
            Photo
          </button>
        </div>

        {isExpanded && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setBody("");
                handleRemoveImage();
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canPost || isLoading}
              isLoading={isLoading}
            >
              Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostBox;
