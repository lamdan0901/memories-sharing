import {
  Container,
  Grow,
  Button,
  Box,
  TextField,
  Typography,
  FormControlLabel,
  useTheme,
  Stack,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

import Posts from "./Posts/Posts";
import Form from "../../components/Form/Form";
import { useAppSelector } from "../../store/store";
import { useGetPostsQuery, useGetPostsLikesQuery } from "../../apis/postSlice";
import { useDebounce, useQuery } from "../../hooks";
import Loading from "../../components/Loading/Loading";
import Pagination from "../../components/Pagination";

function Home() {
  const theme = useTheme();
  const query = useQuery();
  const navigate = useNavigate();
  const [modalOpen, setModelOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const page = query.get("page") || "1";
  const searchQuery = query.get("search") || "";
  const tagsQuery = query.get("tags") || "";
  const isMineQuery = query.get("isMine") === "true" || false;

  const { user } = useAppSelector((state) => state.app);
  const [isMine, setIsMine] = useState(isMineQuery);
  const [searchValue, setSearchValue] = useState(() => ({
    text: searchQuery,
    tags: tagsQuery ?? "",
  }));

  const [queryValues, setQueryValues] = useState(() => ({
    page,
    isMine,
    text: searchQuery,
    tags: tagsQuery ?? "",
  }));

  const { data, isLoading } = useGetPostsQuery(queryValues);
  const { data: likes } = useGetPostsLikesQuery(queryValues);

  useEffect(() => {
    setQueryValues({ page, text: searchQuery, tags: tagsQuery, isMine });
  }, [page, searchQuery, tagsQuery, isMine]);

  useEffect(() => {
    setPosts(
      () =>
        data?.posts.map((post) => {
          const like = likes?.find((like) => like._id === post._id);
          return like ? Object.assign({}, like, post) : post;
        }) ?? []
    );
  }, [data?.posts, likes]);

  useDebounce(handleNavigationAndQuery, 600, [
    searchValue.text,
    searchValue.tags,
    isMine,
  ]);

  function handleNavigationAndQuery(toPage?: string) {
    navigate(
      `/posts?page=${toPage ?? page}&search=${searchValue.text}&tags=${
        searchValue.tags
      }&isMine=${!!isMine}`
    );
    setQueryValues({
      page: toPage ?? page,
      text: searchValue.text,
      tags: searchValue.tags,
      isMine,
    });
  }

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
  }

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  if (isLoading) return <Loading />;

  return (
    <Grow in>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          gap={3}
          sx={{
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
            },
          }}
        >
          <Stack
            flex={6}
            width="100%"
            justifyContent="space-between"
            gap={3}
            sx={{
              [theme.breakpoints.up("sm")]: {
                flexDirection: "row",
              },
            }}
          >
            <TextField
              variant="outlined"
              name="text"
              value={searchValue.text}
              label="Search by name"
              onChange={handleSearchTextChange}
              fullWidth
            />
            <TextField
              variant="outlined"
              name="tags"
              value={searchValue.tags}
              label="Search by tag(s)"
              onChange={handleSearchTextChange}
              fullWidth
            />
          </Stack>

          {user ? (
            <Stack
              flex={4}
              gap={3}
              width="100%"
              justifyContent="flex-end"
              direction="row"
              sx={{
                [theme.breakpoints.down("md")]: {
                  justifyContent: "space-between",
                },
              }}
            >
              <FormControlLabel
                label="My Memories"
                control={
                  <Switch
                    checked={isMine}
                    onChange={(e) => setIsMine(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#7063e5", "&:hover": { bgcolor: "#7063e5c7" } }}
                onClick={() => {
                  setModelOpen(true);
                }}
              >
                Add a new memory
              </Button>

              <Form modalOpen={modalOpen} onModelOpen={handleModelOpen} />
            </Stack>
          ) : (
            <Typography color="#555">
              Please login to share your memories
            </Typography>
          )}
        </Box>

        <Pagination
          count={data?.numOfPages}
          page={+page}
          onPageChange={handleNavigationAndQuery}
        />

        <Posts posts={posts} />
      </Container>
    </Grow>
  );
}

export default Home;
