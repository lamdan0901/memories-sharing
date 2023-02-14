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
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../../../apis/postSlice";
import { Card, CardActions, Overlay, Overlay2 } from "./Post.styled";

interface PostProps {
  post: Post;
}

function Post({ post }: PostProps) {
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [modalOpen, setModelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
    setAnchorEl(null);
  }

  async function handleLikePost() {
    await updatePost({
      id: post._id,
      payload: { likeCount: post.likeCount + 1 },
    })
      .unwrap()
      .catch((err) => console.log(err));
  }

  async function handleDeletePost() {
    await deletePost(post._id)
      .unwrap()
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Card>
        <CardMedia
          component="img"
          image={post.selectedFile}
          alt="error while loading image"
          sx={{
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
          }}
        />

        <Overlay>
          <Typography variant="h6" sx={{ textShadow: "0px 0px 8px #111" }}>
            {post.creator}
          </Typography>
          <Typography fontSize={12} sx={{ textShadow: "0px 0px 5px #111" }}>
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Overlay>

        <Overlay2>
          <IconButton
            sx={{ color: "white", background: "#22222238" }}
            size="small"
            onClick={handleOpenMenu}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Overlay2>
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

        <CardActions>
          <Button color="primary" size="small" onClick={handleLikePost}>
            <ThumbUpAlt fontSize="small" />
            Like {post.likeCount}
          </Button>
          <Button color="primary" size="small" onClick={handleDeletePost}>
            <Delete fontSize="small" />
            Delete
          </Button>
        </CardActions>
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
