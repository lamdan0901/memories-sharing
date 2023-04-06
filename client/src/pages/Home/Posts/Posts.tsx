import { CircularProgress, Grid } from "@mui/material";
import Post from "./Post/Post";

interface PostsProps {
  posts?: Post[];
  isLoading: boolean;
}

function Posts({ posts, isLoading }: PostsProps) {
  if (isLoading) return <CircularProgress />;
  const n = posts?.length ?? 1;

  return (
    <Grid
      container
      alignItems="flex-start"
      spacing={3}
      sx={{
        "@media (max-width: 600px)": {
          justifyContent: "center",
        },
        mt: 0,
        mb: 3.75,
      }}
    >
      <Grid item sm={6} md={4} lg={3} display="flex" flexDirection="column">
        {posts?.slice(0, n / 3)?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </Grid>
      <Grid item sm={6} md={4} lg={3} display="flex" flexDirection="column">
        {posts?.slice(n / 3, (2 * n) / 3)?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </Grid>
      <Grid item sm={6} md={4} lg={3} display="flex" flexDirection="column">
        {posts?.slice((2 * n) / 3)?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </Grid>
    </Grid>
  );
}

export default Posts;
