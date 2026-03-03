interface IPost {
  userId: number;
  id: number | string;
  title: string;
  body: string;
  image?: string | null;
  imageFileId?: string | null;
  createdAt?: string;
  isLocal?: boolean;
}

interface IComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type { IPost, IComment };
