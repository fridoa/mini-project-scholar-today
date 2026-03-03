export type ImageSize = "preview" | "detail" | "thumb";

export const getPhotoUrl = (photoId?: number, size: ImageSize = "detail") => {
  if (!photoId) return "/fallback.png";

  const base = "https://picsum.photos/seed";

  switch (size) {
    case "thumb":
      return `${base}/${photoId}/150/150`;

    case "preview":
      return `${base}/${photoId}/300/300`;

    case "detail":
    default:
      return `${base}/${photoId}/600/600`;
  }
};
