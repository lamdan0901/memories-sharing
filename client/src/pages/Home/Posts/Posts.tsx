import { Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Post from "../../../components/Post/Post";

interface PostsProps {
  posts?: Post[];
}

const splitArray = (posts: Post[], parts: number) => {
  const chunkSize = Math.round(posts.length / parts) || 1; // to avoid chunkSize = 0
  const chunks = [];

  for (let i = 0; i < posts.length; i += chunkSize) {
    chunks.push(posts.slice(i, i + chunkSize));
  }

  if (posts.length === 6 && parts === 4) {
    chunks
      .splice(2)
      .flat()
      .forEach((chunk) => {
        chunks.push([chunk]);
      });
  }

  if (posts.length === 4 && parts === 3) {
    chunks.unshift(chunks.splice(2).flat());
  }

  return chunks;
};

function Posts({ posts = [] }: PostsProps) {
  const theme = useTheme();
  const isBelowSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isBetweenSmMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isBetweenMdLg = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const parts = isBelowSM ? 1 : isBetweenSmMd ? 2 : isBetweenMdLg ? 3 : 4;
  const splitPosts = splitArray(posts, parts);

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
      {splitPosts?.map((posts, i) => (
        <Grid
          item
          key={i}
          sm={6}
          md={4}
          lg={3}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
