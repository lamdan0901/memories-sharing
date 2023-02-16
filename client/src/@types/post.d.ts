interface Post {
  _id?: string;
  title: string;
  message: string;
  creator: string;
  creatorId: string;
  tags: string[] | string;
  selectedFile: string;
  likes: string[];
  createdAt?: Date;
}

type PostPayload = Partial<Post>;
