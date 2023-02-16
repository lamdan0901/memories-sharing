import baseApi from ".";
import { queryTagTypes } from ".";

const BASE_PATH = "/posts";

const postSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => ({
        url: `${BASE_PATH}`,
      }),
      providesTags: [queryTagTypes.POST],
    }),

    createPost: builder.mutation<void, Post>({
      query: (payload) => ({
        method: "POST",
        url: `${BASE_PATH}`,
        body: payload,
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
      { id: Post["_id"]; payload: PostPayload }
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
  useCreatePostMutation,
  useLikePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postSlice;
