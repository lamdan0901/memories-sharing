import {
  Button,
  Divider,
  Paper,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetOnePostQuery } from "../../apis/postSlice";
import Post from "../../components/Posts/Post/Post";
import CommentSection from "./CommentSection";

// interface PostDetailProps{

// }

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetOnePostQuery(id ?? "");

  if (isLoading) return <CircularProgress />;
  if (!data) return "Error occurred!";

  const { post, recommendedPosts } = data;

  return (
    <Paper elevation={6} sx={{ p: 2.5, borderRadius: 3.75, mb: 3.75 }}>
      <div>
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Button onClick={() => navigate("/posts")}>Home</Button>
        <div>
          <img src={post.selectedFile || ""} alt="error while loading image" />
          <Divider sx={{ my: 2.5 }} />
        </div>

        <section>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography sx={{ m: 2.5, fontSize: 12 }} color="textSecondary">
            {(post.tags as string[]).map((tag) => {
              return tag ? `#${tag} ` : "";
            })}
          </Typography>
          <Typography variant="body1" component="p" gutterBottom>
            {post.message}
          </Typography>
          <Typography variant="h6">{data.post.creator}</Typography>
          <Typography variant="body2" component="h2">
            {moment(data.post.createdAt).fromNow()}
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <CommentSection post={post} />

          <Divider sx={{ my: 2.5 }} />
        </section>

        {recommendedPosts && (
          <section>
            <Typography variant="h5" gutterBottom>
              You might also like:
            </Typography>
            <Grid container spacing={2}>
              {recommendedPosts.map((post: Post) => (
                <Grid key={post._id} item sm={6} md={3}>
                  <Post isRecommended post={post} />
                </Grid>
              ))}
            </Grid>
          </section>
        )}
      </div>
    </Paper>
  );
}

export default PostDetail;
