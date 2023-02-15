import { Container, CircularProgress } from "@mui/material";
import { lazy, Suspense, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { setUser } from "./App.reducer";
import { useAppDispatch } from "../store/store";
import Navbar from "../components/Navbar/Navbar";

const Auth = lazy(() => import("../pages/Auth/Auth"));
const Home = lazy(() => import("../pages/Home/Home"));

function App() {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    let isNew = true;
    let currentUser = localStorage.getItem("currentUser");

    if (isNew && currentUser) {
      currentUser = JSON.parse(currentUser);
      dispatch(setUser(currentUser));
    }

    return () => {
      isNew = false;
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Container>
  );
}

export default App;
