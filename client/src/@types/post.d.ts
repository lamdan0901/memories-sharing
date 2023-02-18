interface Post {
  _id?: string;
  comments: string[];
  title: string;
  message: string;
  creator: string;
  creatorId: string;
  tags: string[] | string;
  selectedFile: string;
  likes: string[];
  createdAt?: Date;
}

interface GetPostsPayload {
  page: string;
  text?: string;
  tags?: string;
}

interface GetPostsResponse {
  posts: Post[];
  currentPage: number;
  numOfPages: number;
}

type UpdatePostPayload = Partial<Post>;
