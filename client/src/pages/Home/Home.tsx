import {
  Container,
  Grow,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Posts from "../../components/Posts/Posts";
import Form from "../../components/Form/Form";
import { useAppSelector } from "../../store/store";
import { useGetPostsQuery } from "../../apis/postSlice";
import { useDebounce, useQuery } from "../../hooks";
import Pagination from "../../components/Pagination";

function Home() {
  const query = useQuery();
  const navigate = useNavigate();
  const page = query.get("page") || "1";
  const searchQuery = query.get("search") || "";
  const tagsQuery = query.get("tags") || "";
  const [searchValue, setSearchValue] = useState(() => ({
    text: searchQuery,
    tags: tagsQuery ?? "",
  }));

  const { user } = useAppSelector((state) => state.app);
  const [modalOpen, setModelOpen] = useState(false);

  const [queryValues, setQueryValues] = useState(() => ({
    page,
    text: searchQuery,
    tags: tagsQuery ?? "",
  }));
  const { data, isFetching } = useGetPostsQuery(queryValues);

  useDebounce(handleNavigationAndQuery, 600, [
    searchValue.text,
    searchValue.tags,
  ]);

  function handleNavigationAndQuery(toPage?: string) {
    navigate(
      `/posts?page=${toPage ?? page}&search=${searchValue.text}&tags=${
        searchValue.tags
      }`
    );
    setQueryValues({
      page: toPage ?? page,
      text: searchValue.text,
      tags: searchValue.tags,
    });
  }

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
  }

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <Grow in>
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          alignSelf="flex-end"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <TextField
            variant="outlined"
            name="text"
            value={searchValue.text}
            label="Search by name"
            onChange={handleSearchTextChange}
            sx={{ width: "270px", minWidth: "200px" }}
          />
          <TextField
            variant="outlined"
            name="tags"
            value={searchValue.tags}
            label="Search by tag(s) (separated by . , or space)"
            onChange={handleSearchTextChange}
            sx={{ width: "270px", minWidth: "200px" }}
          />

          {user ? (
            <>
              <Button
                onClick={() => {
                  setModelOpen(true);
                }}
              >
                Add a new memory
              </Button>
              <Form modalOpen={modalOpen} onModelOpen={handleModelOpen} />
            </>
          ) : (
            <Typography color="#555">
              Please login to create or like a memory
            </Typography>
          )}
        </Box>

        <Pagination
          count={data?.numOfPages}
          page={+page}
          onPageChange={handleNavigationAndQuery}
        />

        <Posts posts={data?.posts} isFetching={isFetching} />
      </Container>
    </Grow>
  );
}

export default Home;
