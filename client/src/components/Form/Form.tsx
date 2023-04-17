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
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import imageCompression from "browser-image-compression";

import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../../apis/postSlice";
import { FileInput, FormWrapper } from "./Form.styled";
import { useAppDispatch } from "../../store/store";
import { setSnackMsg } from "../../App/App.reducer";

const initialPost = {
  title: "",
  message: "",
  isPrivate: false,
  tags: [],
  fullSizeImg: "",
  thumbnail: "",
  likes: [],
  comments: [],
};

interface FormModalProps {
  modalOpen: boolean;
  _post?: Post;
  onModelOpen: (value: boolean) => void;
}

function FormModal({ _post, modalOpen, onModelOpen }: FormModalProps) {
  const dispatch = useAppDispatch();
  const [createPost, { status: createPostStatus }] = useCreatePostMutation();
  const [updatePost, { status: updatePostStatus }] = useUpdatePostMutation();
  const [post, setPost] = useState<Post>(() =>
    _post
      ? {
          ..._post,
          tags: (_post.tags as string[]).join(" "),
        }
      : initialPost
  );

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!Array.isArray(post.tags)) {
      post.tags = post.tags.trim().split(/[ .,]/);
    }

    if (post.title.trim() === "") {
      dispatch(setSnackMsg("Title is required!"));
      return;
    }

    if (post.thumbnail === "") {
      dispatch(setSnackMsg("Please select a photo!"));
      return;
    }

    try {
      if (!_post) {
        await createPost(post).unwrap();
      } else {
        await updatePost({ id: post._id, payload: post }).unwrap();
      }

      dispatch(setSnackMsg("Submitted changes"));
      setPost(initialPost);
      onModelOpen(false);
    } catch (err) {
      console.log(err);
      dispatch(setSnackMsg("Changes not submitted, error occurred!"));
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    try {
      const [thumbnailFile, fullSizeImgFile] = await Promise.all([
        imageCompression(imageFile, {
          maxSizeMB: 0.08,
        }),
        imageCompression(imageFile, {
          maxSizeMB: 1,
          initialQuality: imageFile.size / 1024 / 1024 > 1 ? 0.6 : 0.8,
        }),
      ]);

      const [thumbnail, fullSizeImg] = await Promise.all([
        convertToBase64(thumbnailFile),
        convertToBase64(fullSizeImgFile),
      ]);
      if (!thumbnail || !fullSizeImg) throw new Error();

      setPost({ ...post, thumbnail, fullSizeImg });
    } catch (error) {
      dispatch(
        setSnackMsg(
          "Error while uploading photo, please check the photo format"
        )
      );
    }
  }

  function convertToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result;
        resolve(typeof base64String === "string" ? base64String : "");
      };
      reader.onerror = reject;
    });
  }

  function handleFormInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPost((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "isPrivate" ? e.target.checked : e.target.value,
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
                name="title"
                required
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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isPrivate}
                    onChange={handleFormInputChange}
                    name="isPrivate"
                  />
                }
                label="Is private"
                sx={{ width: "100%", mx: 0 }}
              />

              <Box width="97%" mt={1.25} mb={2.5}>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Box>

              {post.thumbnail && (
                <CardMedia
                  component="img"
                  image={post.thumbnail}
                  alt="error while loading image"
                  sx={{
                    "&.MuiCardMedia-img": {
                      maxHeight: "250px",
                    },
                    marginBottom: 1.5,
                  }}
                />
              )}

              <Stack my={2} direction="row" width="100%" gap={1.5}>
                <Button
                  type="button"
                  variant="contained"
                  sx={{ bgcolor: "#888", "&:hover": { bgcolor: "#888888c7" } }}
                  fullWidth
                  onClick={() => {
                    onModelOpen(false);
                    setPost(initialPost);
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#7063e5",
                    "&:hover": { bgcolor: "#7063e5c7" },
                  }}
                  size="large"
                  disabled={
                    createPostStatus === "pending" ||
                    updatePostStatus === "pending"
                  }
                  fullWidth
                >
                  Submit
                </Button>
              </Stack>
            </FormWrapper>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}

export default FormModal;
