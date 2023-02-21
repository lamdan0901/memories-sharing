import { Container, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Snackbar from "../components/Snackbar/Snackbar";

const Auth = lazy(() => import("../pages/Auth/Auth"));
const Home = lazy(() => import("../pages/Home/Home"));
//@ts-ignore
const PostDetail = lazy(() => import("../pages/PostDetail/PostDetail"));

function App() {
  return (
    <Container maxWidth="xl">
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="/" element={<Navigate to="/posts" />} />
            <Route path="/posts" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/search" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>

        <Snackbar />
      </BrowserRouter>
    </Container>
  );
}

export default App;
