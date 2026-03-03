import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import postService from "@/services/post.service";
import mediaService from "@/services/media.service";
import useAuthStore from "@/stores/useAuthStore";

interface CreatePostData {
  title: string;
  body: string;
  image?: File | null;
}

export const useCreatePost = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      let imageUrl: string | undefined;
      let imageFileId: string | undefined;

      if (data.image) {
        setIsUploading(true);
        const uploadRes = await mediaService.upload(data.image);
        const uploadData = uploadRes.data?.data;
        imageUrl = uploadData?.url;
        imageFileId = uploadData?.fileId;
        setIsUploading(false);
      }

      return postService.createPost({
        userId: user!.id,
        title: data.title,
        body: data.body,
        image: imageUrl,
        imageFileId,
      });
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.resetQueries({ queryKey: ["posts", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "profile"] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: () => {
      setIsUploading(false);
      toast.error("Failed to create post.");
    },
  });

  return {
    createPost: mutation.mutate,
    isLoading: mutation.isPending || isUploading,
    isUploading,
  };
};
