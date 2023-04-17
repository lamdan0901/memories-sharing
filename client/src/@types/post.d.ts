interface PostComment {
  content: string;
  creator: Pick<User, "firstName" | "lastName">;
}

interface LikeCount {
  _id: string;
  likeCount: string;
  likes: string[];
}

interface Post {
  _id?: string;
  comments: Comment[];
  title: string;
  isPrivate: boolean;
  message: string;
  creator?: User;
  tags: string[] | string;
  thumbnail: string;
  fullSizeImg: string;
  likeCount?: number;
  likes?: string[];
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
