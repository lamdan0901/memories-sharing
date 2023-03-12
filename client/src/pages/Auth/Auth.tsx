import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogInMutation, useSignUpMutation } from "../../apis/authSlice";
import { setSnackMsg, setUser } from "../../App/App.reducer";
import { useAppDispatch } from "../../store/store";

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState(initialData);
  const [isSignUp, setIsSignUp] = useState(false);

  const [logIn, { status: logInStatus }] = useLogInMutation();
  const [signUp, { status: signUpStatus }] = useSignUpMutation();

  async function handleSubmitForm(e: React.FormEvent<any>) {
    e.preventDefault();

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          console.error("Confirm password not correct");
          return;
        }
        await signUp(formData).unwrap();

        setFormData(initialData);
        setIsSignUp(false);
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
    } catch (err) {
      dispatch(setSnackMsg("Error occurred!"));
      console.log("err: ", err);
    }
  }

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchAuthMode() {
    setIsSignUp((prev) => !prev);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className="auth" elevation={3}>
        <Avatar className="auth__avatar">
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Login"}</Typography>
        <form className="auth__form" onSubmit={handleSubmitForm}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Grid xs={6} md={12} item>
                  <TextField
                    name="firstName"
                    label="First name"
                    value={formData.firstName}
                    autoFocus
                    onChange={handleChangeInput}
                  />
                </Grid>
                <Grid xs={6} md={12} item>
                  <TextField
                    name="lastName"
                    label="Last name"
                    value={formData.lastName}
                    onChange={handleChangeInput}
                  />
                </Grid>
              </>
            )}
            <Grid xs={6} md={12} item>
              <TextField
                type="email"
                name="email"
                value={formData.email}
                label="Email"
                onChange={handleChangeInput}
              />
            </Grid>
            <Grid xs={6} md={12} item>
              <TextField
                type="password"
                name="password"
                value={formData.password}
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
                  label="Confirm Password"
                  onChange={handleChangeInput}
                />
              </Grid>
            )}
          </Grid>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchAuthMode}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign up "}
              </Button>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="auth__submit-btn"
            disabled={logInStatus === "pending" || signUpStatus === "pending"}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;
