import {
  MoreHoriz,
  ThumbUpAlt,
  ShareTwoTone,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import {
  Button,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useLikePostMutation,
  useDeletePostMutation,
} from "../../apis/postSlice";
import { Card, CardActions, Overlay } from "./Post.styled";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setSnackMsg } from "../../App/App.reducer";
import Form from "../Form/Form";

interface PostProps {
  post: Post;
  isRecommended?: boolean;
}

function Post({ post, isRecommended }: PostProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { user } = useAppSelector((state) => state.app);

  const [modalOpen, setModelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      top: 150,
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
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease-out",

            "&.MuiCardMedia-img": {
              transform: "scale(1)",
              "@media (min-width: 600px)": {
                maxHeight: "300px",
              },
              "&:hover": {
                transform: "scale(1.1)",
              },
            },
          }}
        />

        {user?._id === post?.creator?._id && !isRecommended && (
          <Overlay>
            <IconButton
              sx={{ color: "white", background: "#22222238" }}
              size="small"
              onClick={handleOpenMenu}
            >
              <MoreHoriz fontSize="small" />
            </IconButton>
          </Overlay>
        )}

        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleModelOpen(true)}>Edit</MenuItem>
          <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
        </Menu>

        <Typography sx={{ mx: 2.5, mt: 2, fontSize: 12 }} color="#7163e5eb">
          {(post.tags as string[]).map((tag) => {
            return tag ? `#${tag} ` : "";
          })}
        </Typography>

        <CardContent>
          <Typography fontWeight="bold">{post.title}</Typography>
          <Typography fontSize={12} component="p" color="textSecondary">
            by {`${post.creator?.firstName} ${post.creator?.lastName}`}
          </Typography>
        </CardContent>

        {!isRecommended && (
          <CardActions>
            <Button
              size="small"
              onClick={handleLikePost}
              startIcon={
                post.likes.includes(user?._id as string) ? (
                  <ThumbUpAlt fontSize="small" />
                ) : (
                  <ThumbUpAltOutlined fontSize="small" />
                )
              }
              sx={{
                pointerEvents: !user ? "none" : "auto",
              }}
            >
              {post.likes.length} Like{post.likes.length > 1 ? "s" : ""}
            </Button>
            <Button
              size="small"
              startIcon={<ShareTwoTone fontSize="small" />}
              onClick={handleSharePost}
            >
              Share
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
