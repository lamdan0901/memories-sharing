import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loading from "../../../components/Loading/Loading";
import Post from "./Post/Post";

interface PostsProps {
  posts?: Post[];
  isLoading: boolean;
}

const splitArray = (posts: Post[], len: number, parts: number) => {
  const chunkSize = Math.ceil(len / parts);
  const chunks = [];
  for (let i = 0; i < len; i += chunkSize) {
    chunks.push(posts.slice(i, i + chunkSize));
  }
  return chunks;
};

function Posts({ posts = [], isLoading }: PostsProps) {
  const theme = useTheme();
  const isBelowSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isBetweenSmMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isBetweenMdLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isAboveLg = useMediaQuery(theme.breakpoints.up("lg"));

  let parts = 1;
  if (isBelowSM) {
    parts = 1;
  } else if (isBetweenSmMd) {
    parts = 2;
  } else if (isBetweenMdLg) {
    parts = 3;
  } else if (isAboveLg) {
    parts = 4;
  }

  const splitPosts = splitArray(posts, posts?.length, parts);

  if (isLoading) return <Loading />;

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
      {splitPosts?.map((postsPart, i) => (
        <Grid
          gap={3}
          item
          key={i}
          sm={6}
          md={4}
          lg={3}
          display="flex"
          flexDirection="column"
        >
          {postsPart.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
