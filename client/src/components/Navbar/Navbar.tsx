import { Avatar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import MEMORIES from "../../assets/imgs/memories.png";
import { AppBar, Heading, Image } from "./Navbar.styled";
import { useAppSelector } from "../../store/store";

function Navbar() {
  const { user } = useAppSelector((state) => state.app);
  const navigate = useNavigate();

  function logOut() {
    localStorage.clear();
    navigate("/auth", { replace: true });
  }

  return (
    <AppBar position="static" color="inherit">
      <div>
        <Heading variant="h2" align="center">
          Memories
        </Heading>
        <Image src={MEMORIES} alt="memories" height={60} width={60} />
      </div>
      <Toolbar>
        {user ? (
          <>
            <Avatar
              className="navbar__avatar"
              alt={user.firstName}
              src={user.imageUrl}
            >
              {user?.firstName.charAt(0)}
            </Avatar>
            <Typography className="navbar__name" variant="h6">
              {user.name}
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
