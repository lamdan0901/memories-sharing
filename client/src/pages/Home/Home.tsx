import { Container, Grow, Button, Box } from "@mui/material";
import React, { useState } from "react";

import Posts from "../../components/Posts/Posts";
import Form from "../../components/Form/Form";

function Home() {
  const [modalOpen, setModelOpen] = useState(false);

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
  }

  return (
    <Grow in>
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ alignSelf: "flex-end" }}>
          <Button
            onClick={() => {
              setModelOpen(true);
            }}
          >
            Add a new memory
          </Button>
          <Form modalOpen={modalOpen} onModelOpen={handleModelOpen} />
        </Box>

        <Posts />
      </Container>
    </Grow>
  );
}

export default Home;
