import { Delete, MoreHoriz, ThumbUpAlt } from "@mui/icons-material";
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

import Form from "../../Form/Form";
import {
  useLikePostMutation,
  useDeletePostMutation,
} from "../../../apis/postSlice";
import { Card, CardActions, Overlay, Overlay2 } from "./Post.styled";
import { useAppSelector } from "../../../store/store";
import { useNavigate } from "react-router-dom";

interface PostProps {
  post: Post;
  isRecommended?: boolean;
}

function Post({ post, isRecommended }: PostProps) {
  const { user } = useAppSelector((state) => state.app);
  const [likePost] = useLikePostMutation();
  const [deletePost] = useDeletePostMutation();
  const navigate = useNavigate();

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
    await likePost(post._id as string)
      .unwrap()
      .catch((err) => console.log(err));
  }

  async function handleDeletePost() {
    await deletePost(post._id)
      .unwrap()
      .catch((err) => console.log(err));
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
              {post.creator}
            </Typography>
            <Typography fontSize={12} sx={{ textShadow: "0px 0px 5px #111" }}>
              {moment(post.createdAt).fromNow()}
            </Typography>
          </Overlay>
        )}

        {user?._id === post.creatorId && !isRecommended && (
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
          <MenuItem onClick={() => handleModelOpen(true)}>Edit Memory</MenuItem>
        </Menu>

        <Typography sx={{ m: 2.5, fontSize: 12 }} color="textSecondary">
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
            {user?._id === post.creatorId && (
              <Button color="warning" size="small" onClick={handleDeletePost}>
                <Delete fontSize="small" />
                Delete
              </Button>
            )}
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
