interface Post {
  _id?: string;
  comments: string[];
  title: string;
  isPrivate: boolean;
  message: string;
  creator?: User;
  tags: string[] | string;
  selectedFile: string;
  likes: string[];
  createdAt?: Date;
}

interface GetPostsPayload {
  page: string;
  text?: string;
  tags?: string;
  isMine?: boolean;
}

interface GetPostsResponse {
  posts: Post[];
  currentPage: number;
  numOfPages: number;
}

type UpdatePostPayload = Partial<Post>;
