import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetOnePostQuery } from "../../apis/postSlice";
import Post from "../../components/Post/Post";
import CommentSection from "./CommentSection";

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading } = useGetOnePostQuery(id ?? "");

  if (isLoading) return <CircularProgress />;
  if (!data)
    return (
      <Typography variant="h3" color="red">
        Post not found!
      </Typography>
    );

  const { post, recommendedPosts } = data;

  return (
    <Paper elevation={6} sx={{ p: 2.5, borderRadius: 3.75, mb: 3.75 }}>
      <Container>
        <Box mb={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            startIcon={<PermMediaIcon />}
            onClick={() => navigate("/posts")}
            sx={{ ml: 2 }}
          >
            Home
          </Button>
        </Box>

        <Box
          bgcolor="#eeeeff8c"
          borderRadius={2.5}
          flexDirection={isBelowMd ? "column" : "row"}
          display="flex"
          gap={isBelowMd ? 0 : 2}
        >
          <img
            src={post.selectedFile || ""}
            alt="error while loading image"
            style={{
              maxWidth: isBelowMd ? "100%" : "65%",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            m={isBelowMd ? 2 : 0}
            pr={isBelowMd ? 0 : 2}
            mt={2}
          >
            <Box>
              <Typography
                variant={isBelowMd ? "h5" : "h4"}
                component="h2"
                gutterBottom
              >
                {post.title}
              </Typography>
              <Typography
                variant="body1"
                textAlign="justify"
                component="p"
                gutterBottom
              >
                {post.message}
              </Typography>
              <Typography
                fontSize={14}
                component="p"
                gutterBottom
                color="textSecondary"
              >
                by{" "}
                <i>{`${post.creator?.firstName} ${post.creator?.lastName}`}</i>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="h2">
                {moment(data.post.createdAt).fromNow()}
              </Typography>
            </Box>

            <Typography sx={{ my: 2, fontSize: 12 }} color="#7063e5">
              {(post.tags as string[]).map((tag) => {
                return tag ? `#${tag} ` : "";
              })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <CommentSection post={post} />

        <Divider sx={{ my: 2.5 }} />

        {recommendedPosts.length > 0 && (
          <Box mb={2.5}>
            <Typography variant="h5" gutterBottom>
              You might also like
            </Typography>
            <Grid alignItems="flex-start" container spacing={2}>
              {recommendedPosts.map((post: Post) => (
                <Grid key={post._id} item sm={6} md={3}>
                  <Post isRecommended post={post} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Paper>
  );
}

export default PostDetail;
