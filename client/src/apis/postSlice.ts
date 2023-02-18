import baseApi from ".";
import { queryTagTypes } from ".";

const BASE_PATH = "/posts";

const postSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, GetPostsPayload>({
      query: ({ page, text, tags }) => ({
        url: `${BASE_PATH}?page=${page}&search=${text || ""}&tags=${
          tags || ""
        }`,
      }),
      providesTags: [queryTagTypes.POST],
    }),

    getOnePost: builder.query<{ post: Post; recommendedPosts: Post[] }, string>(
      {
        query: (id) => ({
          url: `${BASE_PATH}/${id}`,
        }),
        providesTags: [queryTagTypes.POST],
      }
    ),

    createPost: builder.mutation<void, Post>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}`,
        body: payload,
      }),
      invalidatesTags: [queryTagTypes.POST],
    }),

    commentPost: builder.mutation<void, { finalComment: string; id: string }>({
      query: ({ finalComment, id }) => ({
        method: "PATCH",
        url: `${BASE_PATH}/${id}-commentPost`,
        body: { comment: finalComment },
      }),
      invalidatesTags: [queryTagTypes.POST],
    }),

    likePost: builder.mutation<void, string>({
      query: (id) => ({
        method: "PATCH",
        url: `${BASE_PATH}/${id}-likePost`,
      }),
      invalidatesTags: [queryTagTypes.POST],
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
      invalidatesTags: [queryTagTypes.POST],
    }),

    deletePost: builder.mutation<void, Post["_id"]>({
      query: (id) => ({
        method: "DELETE",
        url: `${BASE_PATH}/${id}`,
      }),
      invalidatesTags: [queryTagTypes.POST],
    }),
  }),
});

export default postSlice;

export const {
  useGetPostsQuery,
  useGetOnePostQuery,
  useCreatePostMutation,
  useCommentPostMutation,
  useLikePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postSlice;
