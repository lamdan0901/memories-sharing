import {
  Avatar,
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import { useAppDispatch } from "../../store/store";
import { setSnackMsg, setUser } from "../../App/App.reducer";
import AVATAR from "../../assets/imgs/avatar.png";
import MEMORY from "../../assets/imgs/memories.png";

function Navbar() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isBelowSM = useMediaQuery(theme.breakpoints.down("sm"));

  useLayoutEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token !== null && token !== "undefined") {
        const decodedToken = jwt_decode(token);
        if ((decodedToken as any).exp * 1000 < new Date().getTime()) {
          localStorage.clear();
        }
      } else return;

      let savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        savedUser = JSON.parse(savedUser);
        //@ts-ignore
        setCurrentUser(savedUser);
        dispatch(setUser(savedUser));
      }
    } catch (err) {
      console.log("err: ", err);
    }
  }, [location.href]);

  function logOut() {
    localStorage.clear();
    setCurrentUser(null);
    navigate("/auth?type=login", { replace: true });
    dispatch(setSnackMsg("You've logged out!"));
    dispatch(setUser(null));
  }

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        py: 2,
        borderRadius: "15px",
        margin: "30px 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center",
          },
        }}
      >
        <Link
          to="/posts"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src={MEMORY}
            alt="memories"
            height={isBelowSM ? 45 : 60}
            width={isBelowSM ? 45 : 60}
          />
          <Typography
            color="#7163e5eb"
            variant={isBelowSM ? "h4" : "h3"}
            align="right"
            fontFamily="'Dancing Script', cursive"
          >
            Memories
          </Typography>
        </Link>

        <Toolbar disableGutters>
          {currentUser ? (
            <>
              <Avatar alt={currentUser.firstName} src={AVATAR} />
              <Typography
                color="#594bd7"
                variant={isBelowSM ? "body1" : "h6"}
                sx={{ ml: 1 }}
              >
                {currentUser.firstName + " " + currentUser.lastName}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size={isBelowSM ? "small" : "medium"}
                onClick={logOut}
                sx={{ ml: isBelowSM ? 2 : 4 }}
              >
                Log out
              </Button>
            </>
          ) : (
            <Link to="/auth?type=login">
              <Button
                variant="contained"
                size={isBelowSM ? "small" : "medium"}
                color="primary"
              >
                Log in
              </Button>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
