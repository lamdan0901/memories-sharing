import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import parse from "html-react-parser";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import AVATAR from "../../assets/imgs/avatar.png";
import { useCommentPostMutation } from "../../apis/postSlice";

interface CommentSectionProps {
  post: Post;
}

function CommentSection({ post }: CommentSectionProps) {
  let currentUser: User | null = null;
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) currentUser = JSON.parse(savedUser);

  const [commentPost, { status }] = useCommentPostMutation();
  const [comment, setComment] = useState("");

  async function handleSendComment() {
    if (!currentUser) return;

    await commentPost({ comment, id: post._id ?? "" });
    setComment("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent the default behavior of the input element when we press Enter key (enter a new line)
      handleSendComment();
    }
  }

  return (
    <Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>

        {post.comments?.map(({ content, creator }, i) => {
          return (
            <Stack direction="row" mb={1.5} gap={1} key={i}>
              <Avatar alt={creator.firstName} src={AVATAR} />

              <Stack
                sx={{
                  bgcolor: "#eeeeffbd",
                  border: "1px solid #eee",
                  borderRadius: 2.5,
                  p: 1,
                }}
                gap={1}
                alignItems="start"
              >
                <Typography color="#7063e5" fontWeight="bold">
                  {`${creator.firstName} ${creator.lastName}`}
                </Typography>
                <Typography>
                  {parse(content.replaceAll(/\n/gi, "<br />"))}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Box>

      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Write a comment
        </Typography>
        <Stack direction="row">
          <TextField
            fullWidth
            variant="outlined"
            label="Your comment here"
            placeholder="Enter to send"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={status === "pending"}
            sx={{ mr: 2 }}
          />
          <Button
            disabled={!comment || !currentUser || status === "pending"}
            onClick={handleSendComment}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Stack>

        {!currentUser && (
          <Stack direction="row">
            <Typography variant="body2">
              You need to login in order to comment on this post.{" "}
              <Link to="/auth">Login now</Link>
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default CommentSection;
