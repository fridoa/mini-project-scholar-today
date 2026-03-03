interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface IAlbum {
  userId: number;
  id: number;
  title: string;
}

interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export type { IUser, IAlbum, IPhoto, ITodo };
