import { Container } from "@mui/material";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Snackbar from "../components/Snackbar/Snackbar";
import Loading from "../components/Loading/Loading";

const Auth = lazy(() => import("../pages/Auth/Auth"));
const Home = lazy(() => import("../pages/Home/Home"));
const PostDetail = lazy(() => import("../pages/PostDetail/PostDetail"));

function App() {
  return (
    <Container maxWidth="xl">
      <BrowserRouter>
        <Navbar />
        <Snackbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/posts" />} />
            <Route path="/posts" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/search" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Container>
  );
}

export default App;
