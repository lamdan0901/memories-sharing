import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useLogInMutation, useSignUpMutation } from "../../apis/authSlice";
import { setSnackMsg, setUser } from "../../App/App.reducer";
import { useAppDispatch } from "../../store/store";

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type");

  const [formData, setFormData] = useState(initialData);
  const [isSignUp, setIsSignUp] = useState(type === "sign-up");

  const [logIn, { status: logInStatus }] = useLogInMutation();
  const [signUp, { status: signUpStatus }] = useSignUpMutation();

  async function handleSubmitForm(e: React.FormEvent<any>) {
    e.preventDefault();

    if (!inputsValid()) return;

    try {
      if (isSignUp) {
        await signUp(formData).unwrap();

        localStorage.setItem("email", formData.email);
        setFormData(initialData);
        setIsSignUp(false);
        navigate("/auth?type=login");
        dispatch(setSnackMsg("Sign up successfully!"));
        return;
      }

      const res = await logIn(formData).unwrap();

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("currentUser", JSON.stringify(res.currentUser));
      dispatch(setUser(res.currentUser));
      setFormData(initialData);
      dispatch(setSnackMsg("Log in successfully!"));
      navigate("/");
    } catch (err: any) {
      dispatch(setSnackMsg(err?.data?.message ?? "Error occurred!"));
      console.log("err: ", err);
    }
  }

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchAuthMode() {
    setIsSignUp((prev) => !prev);
    navigate(`/auth?type=${isSignUp ? "login" : "sign-up"}`);
  }

  function inputsValid() {
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        dispatch(setSnackMsg("Confirm password not correct"));
        return false;
      }

      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.username
      ) {
        dispatch(setSnackMsg("Input fields not left blank"));
        return false;
      }
    }

    if (!formData.username || !formData.password) {
      dispatch(setSnackMsg("Input fields not left blank"));
      return false;
    }

    return true;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ borderRadius: 2 }} elevation={3}>
        <Box
          p={2}
          gap={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">{isSignUp ? "Sign Up" : "Login"}</Typography>
        </Box>

        <form onSubmit={handleSubmitForm}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {isSignUp && (
              <>
                <Grid xs={6} md={12} item>
                  <TextField
                    name="firstName"
                    label="First name"
                    value={formData.firstName}
                    autoFocus
                    fullWidth
                    onChange={handleChangeInput}
                  />
                </Grid>
                <Grid xs={6} md={12} item>
                  <TextField
                    name="lastName"
                    label="Last name"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChangeInput}
                  />
                </Grid>
                <Grid xs={6} md={12} item>
                  <TextField
                    type="email"
                    name="email"
                    value={formData.email}
                    fullWidth
                    label="Email"
                    onChange={handleChangeInput}
                  />
                </Grid>
              </>
            )}

            <Grid xs={6} md={12} item>
              <TextField
                type="text"
                name="username"
                value={formData.username}
                fullWidth
                label="Username"
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid xs={6} md={12} item>
              <TextField
                type="password"
                name="password"
                value={formData.password}
                fullWidth
                label="Password"
                onChange={handleChangeInput}
              />
            </Grid>

            {isSignUp && (
              <Grid xs={6} md={12} item>
                <TextField
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  fullWidth
                  label="Confirm Password"
                  onChange={handleChangeInput}
                />
              </Grid>
            )}

            <Grid xs={6} md={12} item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={
                  logInStatus === "pending" || signUpStatus === "pending"
                }
              >
                Submit
              </Button>
            </Grid>

            <Grid item>
              <Button onClick={switchAuthMode}>
                {isSignUp
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign up "}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;
