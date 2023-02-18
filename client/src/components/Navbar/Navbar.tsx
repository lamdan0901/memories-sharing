import { Avatar, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import MEMORIES from "../../assets/imgs/memories.png";
import { AppBar, Heading, Image } from "./Navbar.styled";
import { useAppDispatch } from "../../store/store";
import { setUser } from "../../App/App.reducer";
import { useLayoutEffect, useState } from "react";

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      if ((decodedToken as any).exp * 1000 < new Date().getTime()) {
        localStorage.clear();
      }
    } else return;

    let savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      savedUser = JSON.parse(savedUser);
      setCurrentUser(savedUser);
      dispatch(setUser(savedUser));
    }
  }, [location.href]);

  function logOut() {
    localStorage.clear();
    setCurrentUser(null);
    navigate("/auth", { replace: true });
  }

  return (
    <AppBar position="static" color="inherit" sx={{ py: 2 }}>
      <Link to="/posts">
        <Heading variant="h2" align="left">
          Memories
        </Heading>
        <Image src={MEMORIES} alt="memories" height={60} width={60} />
      </Link>
      <Toolbar>
        {currentUser ? (
          <>
            <Avatar
              className="navbar__avatar"
              alt={currentUser.firstName}
              src={""}
            >
              {currentUser?.firstName.charAt(0)}
            </Avatar>
            <Typography className="navbar__name" variant="h6">
              {currentUser.firstName + " " + currentUser.lastName}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              className="navbar__btn-logout"
              onClick={logOut}
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button variant="contained" color="primary">
                Log in
              </Button>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
