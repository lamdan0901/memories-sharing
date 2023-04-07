import { Avatar, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { AppBar, Heading, Image } from "./Navbar.styled";
import { useAppDispatch } from "../../store/store";
import { setSnackMsg, setUser } from "../../App/App.reducer";
import { useLayoutEffect, useState } from "react";

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    navigate("/auth", { replace: true });
    dispatch(setSnackMsg("You've logged out!"));
  }

  return (
    <AppBar position="static" color="inherit" sx={{ py: 2 }}>
      <Link to="/posts" style={{ display: "flex", textDecoration: "none" }}>
        <Heading variant="h2" align="left">
          Memories
        </Heading>
        <Image
          src="src/assets/imgs/memories.png"
          alt="memories"
          height={60}
          width={60}
        />
      </Link>

      <Toolbar>
        {currentUser ? (
          <>
            <Avatar
              className="navbar__avatar"
              alt={currentUser.firstName}
              src={"src/assets/imgs/avatar.png"}
            ></Avatar>
            <Typography className="navbar__name" variant="h6" sx={{ ml: 1 }}>
              {currentUser.firstName + " " + currentUser.lastName}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              className="navbar__btn-logout"
              onClick={logOut}
              sx={{ ml: 4 }}
            >
              Log out
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="contained" color="primary">
              Log in
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
