import { CircularProgress, Grid } from "@mui/material";
import { useGetPostsQuery } from "../../apis/postSlice";
import Post from "./Post/Post";

function Posts() {
  const { data: posts, isLoading } = useGetPostsQuery();

  if (isLoading) return <CircularProgress />;

  return (
    <Grid
      container
      alignItems={"stretch"}
      spacing={3}
      sx={{
        "@media (max-width: 600px)": {
          justifyContent: "center",
        },
        mt: 0,
      }}
    >
      {posts?.map((post) => (
        <Grid key={post._id} item sm={6} md={3}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
