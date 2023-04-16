import { ThumbUpAlt, ThumbUpAltOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
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

import {
  useLikePostMutation,
  useGetOnePostQuery,
  useGetPostCommentsQuery,
} from "../../apis/postSlice";
import Post from "../../components/Post/Post";
import CommentSection from "./CommentSection";
import { setSnackMsg } from "../../App/App.reducer";
import Loading from "../../components/Loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/store";

function PostDetail() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [likePost] = useLikePostMutation();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams();
  const { user } = useAppSelector((state) => state.app);
  const { data, isLoading } = useGetOnePostQuery(id ?? "");
  const { data: postCommentsNLikes } = useGetPostCommentsQuery(id ?? "");

  if (isLoading) return <Loading />;
  if (!data)
    return (
      <Typography variant="h3" color="red">
        Post not found!
      </Typography>
    );

  const { post, recommendedPosts } = data;
  const { comments, likes } = postCommentsNLikes ?? {};

  async function handleLikePost() {
    try {
      await likePost(post._id as string).unwrap();
    } catch (err) {
      dispatch(setSnackMsg("Error occurred!"));
      console.log(err);
    }
  }

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
            sx={{ mx: 2 }}
          >
            Home
          </Button>

          <Button
            size="small"
            onClick={handleLikePost}
            startIcon={
              likes?.includes(user?._id as string) ? (
                <ThumbUpAlt fontSize="small" />
              ) : (
                <ThumbUpAltOutlined fontSize="small" />
              )
            }
            sx={{
              pointerEvents: !user ? "none" : "auto",
            }}
          >
            {likes?.length} Like
            {likes && likes.length > 1 ? "s" : ""}
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
            src={post.fullSizeImg || ""}
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

        <CommentSection postId={post._id} postComments={comments} />

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
