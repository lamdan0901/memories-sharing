//@ts-ignore
import FileBase from "react-file-base64";
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Modal,
  Fade,
  CardMedia,
} from "@mui/material";

import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../../apis/postSlice";
import { FileInput, FormWrapper } from "./Form.styled";

const initialPost = {
  creator: "",
  title: "",
  message: "",
  tags: [],
  selectedFile: "",
  likeCount: 0,
};

interface FormModalProps {
  modalOpen: boolean;
  _post?: Post;
  onModelOpen: (value: boolean) => void;
}

function FormModal({ _post, modalOpen, onModelOpen }: FormModalProps) {
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [post, setPost] = useState<Post>(() => _post ?? initialPost);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!Array.isArray(post.tags)) {
      post.tags = post.tags.split(/[ .,]/);
    }
    console.log("post.tags: ", post.tags);

    try {
      if (!_post) {
        await createPost(post).unwrap();
      } else {
        await updatePost({ id: post._id, payload: post }).unwrap();
      }

      setPost(initialPost);
      onModelOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  function handleFormInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Modal
      open={modalOpen}
      onClose={() => onModelOpen(false)}
      closeAfterTransition
    >
      <Fade in={modalOpen}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          p={4}
          sx={{ transform: "translate(-50%, -50%)", overflow: "auto" }}
        >
          <Paper sx={{ padding: 2 }}>
            <FormWrapper autoComplete="off" noValidate onSubmit={submitForm}>
              <Typography variant="h6">
                {_post ? "Edit" : "Create"} a Memory
              </Typography>

              <TextField
                name="creator"
                variant="outlined"
                label="Creator"
                fullWidth
                sx={{ margin: 1 }}
                value={post.creator}
                onChange={handleFormInputChange}
              />
              <TextField
                name="title"
                variant="outlined"
                label="Title"
                fullWidth
                sx={{ margin: 1 }}
                value={post.title}
                onChange={handleFormInputChange}
              />
              <TextField
                name="message"
                variant="outlined"
                label="Message"
                fullWidth
                sx={{ margin: 1 }}
                value={post.message}
                onChange={handleFormInputChange}
              />
              <TextField
                name="tags"
                variant="outlined"
                label="Tags (separated with . , or space)"
                fullWidth
                sx={{ margin: 1 }}
                value={post.tags ?? ""}
                onChange={handleFormInputChange}
              />

              <FileInput>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }: any) =>
                    setPost({ ...post, selectedFile: base64 })
                  }
                />
              </FileInput>

              {post.selectedFile && (
                <CardMedia
                  component="img"
                  image={post.selectedFile}
                  alt="error while loading image"
                  sx={{
                    "&.MuiCardMedia-img": {
                      maxHeight: "250px",
                    },
                    marginBottom: 1.5,
                  }}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                color="warning"
                fullWidth
                onClick={() => setPost(initialPost)}
                sx={{ marginY: 1.5 }}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  onModelOpen(false);
                  setPost(initialPost);
                }}
              >
                Close
              </Button>
            </FormWrapper>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}

export default FormModal;
