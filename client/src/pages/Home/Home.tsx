import {
  Container,
  Grow,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import Posts from "../../components/Posts/Posts";
import Form from "../../components/Form/Form";
import { useAppSelector } from "../../store/store";
import { useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

function Home() {
  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("search");
  // const history = useHistory()

  const { user } = useAppSelector((state) => state.app);
  const [modalOpen, setModelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(() => ({
    text: "",
    tags: "",
  }));

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
  }

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSearchMemory() {
    const tags = searchValue.tags.split(" ,.");
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
            label="Memory name"
            onKeyDown={(e) => (e.key === "Enter" ? handleSearchMemory() : null)}
            onChange={handleSearchTextChange}
            sx={{ width: "270px", minWidth: "200px" }}
          />
          <TextField
            variant="outlined"
            name="tags"
            value={searchValue.tags}
            label="Memory tag(s) (separated by . , or space)"
            onKeyDown={(e) => (e.key === "Enter" ? handleSearchMemory() : null)}
            onChange={handleSearchTextChange}
            sx={{ width: "270px", minWidth: "200px" }}
          />
          <Button
            onClick={() => {
              handleSearchMemory();
            }}
          >
            Search
          </Button>

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

        <Posts />
      </Container>
    </Grow>
  );
}

export default Home;
