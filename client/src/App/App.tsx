import MEMORIES from "./assets/imgs/memories.png";
import { AppBar, Container, Grid, Grow, Typography } from "@mui/material";
import Posts from "../components/Posts/Posts";
import Form from "../components/Form/Form";

function App() {
  return (
    <Container maxWidth="lg">
      <AppBar position="static" color="inherit">
        <Typography variant="h2" align="center">
          Memories
        </Typography>
        <img src={MEMORIES} alt="memories" height="60" width={60} />
      </AppBar>

      <Grow in>
        <Container>
          <Grid
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12} sm={7}>
              <Posts />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Form />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Container>
  );
}

export default App;
