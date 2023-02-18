import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import parse from "html-react-parser";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCommentPostMutation } from "../../apis/postSlice";

interface CommentSectionProps {
  post: Post;
}

// in the future, if I have time, I will implement more for this and other sections
// such as 'like comment, commentTime, rep to a cmt, lazy-loading-pagination for comment section,
//  show the user's avatar, set up user profile ...'

function CommentSection({ post }: CommentSectionProps) {
  let currentUser: User | null = null;
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) currentUser = JSON.parse(savedUser);

  const [commentPost] = useCommentPostMutation();
  const [comment, setComment] = useState("");

  function handleSendComment() {
    if (!currentUser) return;

    const finalComment = `${currentUser.firstName} ${currentUser.lastName}: ${comment}`;
    commentPost({ finalComment, id: post._id ?? "" });
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
        <Box>
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>
          {post.comments.map((comment, i) => {
            comment = comment.replaceAll(/\n/gi, "<br />");
            return <Typography key={i}>{parse(comment)}</Typography>;
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
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
              sx={{ mr: 2 }}
            />
            <Button
              disabled={!comment || !currentUser}
              onClick={handleSendComment}
            >
              Send
            </Button>
          </Stack>

          {!currentUser && (
            <Stack direction="row">
              <Typography variant="body2">
                You need to login in order to comment on this post
              </Typography>
              <Link to="/auth">Login now</Link>
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default CommentSection;
