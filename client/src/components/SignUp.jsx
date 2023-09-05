import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { MuiOtpInput } from "mui-one-time-password-input";
import OtpTimer from "otp-timer";

export default function SignUp({ innerPath, user, setState, setUser }) {
  const [otp, setOtp] = useState("");

  const otpChange = (newValue) => {
    setOtp(newValue);
    if (newValue.length !== 6) return;
    verifyOtp(newValue);
  };
  const resendOtp = () => {
    setUser(null);
    setState({ route: "/signup" });
  };
  const verifyOtp = (updatedOtp) => {
    setState((state) => {
      return { ...state, loading: true };
    });

    axios
      .post(`http://localhost:4000/user/verifyOtp`, { email: user.email, otp: updatedOtp })
      .then((response) => {
        setState({ route: "/login" });
        alert(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        setState((state) => {
          return { ...state, loading: false };
        });
        alert(error.response.data.message);
      });
  };
  const handleSignup = (event) => {
    event.preventDefault();
    const [name, email, password] = [...new FormData(event.currentTarget).values()];
    setState((state) => {
      return { ...state, loading: true };
    });

    axios
      .post(`http://localhost:4000/user/`, { email, name, password })
      .then((response) => {
        setUser(response.data.data);
        setState({ route: "/signup/otp" });
      })
      .catch((error) => {
        console.log(error);
        [403, 400].includes(error.response.status)
          ? (alert(error.response.data.error.message),
            setState((state) => {
              return { ...state, loading: false };
            }))
          : setState((state) => {
              return { ...state, route: "/error", error: error, loading: false };
            });
      });
  };
  const gotoLogin = (event) => {
    event.preventDefault();
    setState({ route: "/login" });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {innerPath == "/" ? "Sign up" : "Verify Email"}
        </Typography>
        {innerPath == "/" ? (
          <>
            {/* Signup form */}
            <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={gotoLogin} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            {/* OTP form */}
            <Box>
              <MuiOtpInput
                length={6}
                columnGap={1}
                inputMode="numeric"
                value={otp}
                onChange={otpChange}
                marginBottom={3}
                marginTop={3}
              />
              <OtpTimer
                minutes={1}
                seconds={59}
                text="Time:"
                ButtonText="Go to signup"
                resend={resendOtp}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
