import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Post from "./Post/Post";

interface PostsProps {
  posts?: Post[];
  isLoading: boolean;
}

const splitArray = (arr: any[], len: number, parts: number) => {
  const chunkSize = Math.ceil(len / parts);
  const chunks = [];
  for (let i = 0; i < len; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

function Posts({ posts, isLoading }: PostsProps) {
  const theme = useTheme();
  if (isLoading) return <CircularProgress />;
  const n = posts?.length ?? 1;

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  let parts = 1;
  if (isSmallScreen) {
    parts = 1;
  } else if (isMediumScreen) {
    parts = 2;
  } else if (isLargeScreen) {
    parts = 3;
  } else if (isExtraLargeScreen) {
    parts = 4;
  }

  const splitPosts = splitArray(posts, n, parts);

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
      {splitPosts.map((postsPart, i) => (
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
