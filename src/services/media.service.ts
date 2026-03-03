import endpoint from "@/services/endpoint.constant";
import instance from "@/lib/axios/instance";

const mediaService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return instance.post(`${endpoint.MEDIA}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  remove: (fileId: string) => instance.delete(`${endpoint.MEDIA}/${fileId}`),
};

export default mediaService;
