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
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import AVATAR from "../../assets/imgs/avatar.png";
import { useCommentPostMutation } from "../../apis/postSlice";

interface CommentSectionProps {
  postId?: string;
  postComments?: PostComment[];
}

function CommentSection({ postId, postComments }: CommentSectionProps) {
  let currentUser: User | null = null;
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) currentUser = JSON.parse(savedUser);

  const commentBoxRef = useRef<HTMLDivElement>(null);
  const [commentPost, { status }] = useCommentPostMutation();
  const [comment, setComment] = useState("");

  async function handleSendComment() {
    if (!currentUser) return;

    await commentPost({
      comment: comment
        .trim()
        .replace(/\n+/g, "\n")
        .replaceAll(/\n/gi, "<br />"),
      id: postId,
    });
    setComment("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent the default behavior of the input element when we press Enter key (enter a new line)
      handleSendComment();
    }
  }

  useEffect(() => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
    }
  }, [postComments]);

  return (
    <Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>

        <Box
          ref={commentBoxRef}
          maxHeight={500}
          overflow="auto"
          bgcolor="#eeeeff8c"
          borderRadius={2.5}
          p={postComments?.length ? 1 : 0}
        >
          {postComments?.map(({ content, creator }, i) => {
            return (
              <Stack direction="row" mb={1.5} gap={1} key={i}>
                <Avatar alt={creator.firstName} src={AVATAR} />

                <Stack
                  gap={1}
                  alignItems="start"
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 2.5,
                    p: 1,
                  }}
                >
                  <Typography color="#7063e5" fontWeight="bold">
                    {`${creator.firstName} ${creator.lastName}`}
                  </Typography>
                  <Typography>{parse(content)}</Typography>
                </Stack>
              </Stack>
            );
          })}
        </Box>
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
          <Typography variant="body2" sx={{ mt: 1 }}>
            You need to login in order to comment on this post.{" "}
            <Link to="/auth?type=login">Login now</Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default CommentSection;
