import baseApi from ".";
import { queryTagTypes } from ".";

const BASE_PATH = "/posts";

const postSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsPayload>({
      query: ({ page, text, tags, isMine }) => ({
        url: `${BASE_PATH}?page=${page}&search=${text || ""}&tags=${
          tags || ""
        }&isMine=${isMine || false}`,
      }),
      providesTags: [queryTagTypes.ALL_POST],
    }),

    getPostsLikes: builder.query<LikeCount[], GetPostsPayload>({
      query: ({ page, text, tags, isMine }) => ({
        url: `${BASE_PATH}/likes?page=${page}&search=${text || ""}&tags=${
          tags || ""
        }&isMine=${isMine || false}`,
      }),
      providesTags: [queryTagTypes.POST_LIKE],
    }),

    getOnePost: builder.query<{ post: Post; recommendedPosts: Post[] }, string>(
      {
        query: (id) => ({
          url: `${BASE_PATH}/${id}`,
        }),
        providesTags: [queryTagTypes.ONE_POST],
      }
    ),

    getPostComments: builder.query<
      { comments: PostComment[]; likes: string[] },
      string
    >({
      query: (id) => ({
        url: `${BASE_PATH}/${id}/comments`,
      }),
      providesTags: [queryTagTypes.POST_COMMENT],
    }),

    createPost: builder.mutation<void, Post>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}`,
        body: payload,
      }),
      invalidatesTags: [queryTagTypes.ALL_POST],
    }),

    commentPost: builder.mutation<void, { comment: string; id?: string }>({
      query: ({ comment, id }) => ({
        method: "PATCH",
        url: `${BASE_PATH}/${id}-commentPost`,
        body: { comment },
      }),
      invalidatesTags: [queryTagTypes.POST_COMMENT],
    }),

    likePost: builder.mutation<void, string>({
      query: (id) => ({
        method: "PATCH",
        url: `${BASE_PATH}/${id}-likePost`,
      }),
      invalidatesTags: [queryTagTypes.POST_LIKE, queryTagTypes.POST_COMMENT],
    }),

    updatePost: builder.mutation<
      void,
      { id: Post["_id"]; payload: UpdatePostPayload }
    >({
      query: ({ id, payload }) => ({
        method: "PATCH",
        url: `${BASE_PATH}/${id}`,
        body: payload,
      }),
      invalidatesTags: [queryTagTypes.ALL_POST],
    }),

    deletePost: builder.mutation<void, Post["_id"]>({
      query: (id) => ({
        method: "DELETE",
        url: `${BASE_PATH}/${id}`,
      }),
      invalidatesTags: [queryTagTypes.ALL_POST],
    }),
  }),
});

export default postSlice;

export const {
  useGetPostsQuery,
  useGetPostsLikesQuery,
  useGetOnePostQuery,
  useGetPostCommentsQuery,
  useCreatePostMutation,
  useCommentPostMutation,
  useLikePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postSlice;
