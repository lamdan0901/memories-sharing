import MEMORIES from "../assets/imgs/memories.png";
import { Container, Grow, Button, Box } from "@mui/material";
import React, { useState } from "react";
import Posts from "../components/Posts/Posts";
import Form from "../components/Form/Form";
import { AppBar, Heading, Image } from "./App.styled";

function App() {
  const [modalOpen, setModelOpen] = useState(false);

  function handleModelOpen(value: boolean) {
    setModelOpen(value);
  }

  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="inherit">
        <Heading variant="h2" align="center">
          Memories
        </Heading>
        <Image src={MEMORIES} alt="memories" height={60} width={60} />
      </AppBar>

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
    </Container>
  );
}

export default App;
