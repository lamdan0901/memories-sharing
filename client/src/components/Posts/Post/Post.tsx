import { MoreHoriz, ThumbUpAlt, ShareTwoTone } from "@mui/icons-material";
import {
  Button,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useLikePostMutation,
  useDeletePostMutation,
} from "../../../apis/postSlice";
import { Card, CardActions, Overlay, Overlay2 } from "./Post.styled";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { setSnackMsg } from "../../../App/App.reducer";
import Form from "../../Form/Form";

interface PostProps {
  post: Post;
  isRecommended?: boolean;
}

function Post({ post, isRecommended }: PostProps) {
  const { user } = useAppSelector((state) => state.app);
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modalOpen, setModelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
    setAnchorEl(null);
  }

  async function handleLikePost() {
    try {
      await likePost(post._id as string).unwrap();
    } catch (err) {
      dispatch(setSnackMsg("Error occurred!"));
      console.log(err);
    }
  }

  async function handleDeletePost() {
    try {
      await deletePost(post._id).unwrap();
      dispatch(setSnackMsg("Post deleted!"));
    } catch (err) {
      dispatch(setSnackMsg("Error occurred!"));
      console.log(err);
    }
    handleCloseMenu();
  }

  function handleSharePost() {
    let port = "";
    if (import.meta.env.VITE_USER_NODE_ENV === "local")
      port = `:${location.port}`;

    navigator.clipboard.writeText(
      `${location.hostname}${port}/posts/${post._id}`
    );

    dispatch(setSnackMsg("Link copied to clipboard!"));
  }

  function viewPostDetail() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    navigate(`/posts/${post._id}`);
  }

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          onClick={viewPostDetail}
          image={post.selectedFile}
          alt="error while loading image"
          sx={cardMediaStyle}
        />

        {!isRecommended && (
          <Overlay>
            <Typography variant="h6" sx={{ textShadow: "0px 0px 8px #111" }}>
              {`${post.creator?.firstName} ${post.creator?.lastName}`}
            </Typography>
            <Typography fontSize={12} sx={{ textShadow: "0px 0px 5px #111" }}>
              {moment(post.createdAt).fromNow()}
            </Typography>
          </Overlay>
        )}

        {user?._id === post?.creator?._id && !isRecommended && (
          <Overlay2>
            <IconButton
              sx={{ color: "white", background: "#22222238" }}
              size="small"
              onClick={handleOpenMenu}
            >
              <MoreHoriz fontSize="small" />
            </IconButton>
          </Overlay2>
        )}
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleModelOpen(true)}>Edit</MenuItem>
          <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
        </Menu>

        <Typography sx={{ m: 2.5, fontSize: 12 }} color="#242fd0">
          {(post.tags as string[]).map((tag) => {
            return tag ? `#${tag} ` : "";
          })}
        </Typography>

        <CardContent>
          <Typography>{post.title}</Typography>
          <Typography fontSize={12} component="p" color="textSecondary">
            {post.message}
          </Typography>
        </CardContent>

        {!isRecommended && (
          <CardActions>
            <Button
              color={
                post.likes.includes(user?._id as string) ? "success" : "primary"
              }
              size="small"
              onClick={handleLikePost}
              sx={{
                pointerEvents: !user ? "none" : "auto",
              }}
            >
              <ThumbUpAlt fontSize="small" />
              &nbsp; {post.likes.length} Like{post.likes.length > 1 ? "s" : ""}
            </Button>
            <Button size="small" onClick={handleSharePost}>
              <ShareTwoTone fontSize="small" />
              &nbsp; Share
            </Button>
          </CardActions>
        )}
      </Card>

      {modalOpen && (
        <Form
          modalOpen={modalOpen}
          onModelOpen={handleModelOpen}
          _post={post}
        />
      )}
    </>
  );
}

export default Post;

const cardMediaStyle = {
  cursor: "pointer",
  transform: "scale(1)",
  transition: "all 0.2s ease-out",
  "&:hover": {
    transform: "scale(1.2)",
  },
  "&.MuiCardMedia-img": {
    maxHeight: "450px",
    "@media (min-width: 600px)": {
      maxHeight: "300px",
    },
  },
};
