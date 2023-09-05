import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";

export default function Login({ setState, setUser }) {
  const handleLogin = (event) => {
    event.preventDefault();
    const [email, password] = [...new FormData(event.currentTarget).values()];
    setState((state) => {
      return { ...state, loading: true };
    });

    axios
      .post(`http://localhost:4000/user/login`, { email, name: email, password })
      .then((response) => {
        setUser(response.data.data);
        setState({ route: "/" });
      })
      .catch((error) => {
        if (error.response) {
          const { status, statusText, data } = error.response;
          setState({ route: "/login" });
          return alert([404, 401].includes(status) ? data.message : statusText);
        }
        setState({ route: "/error", error: error });
      });
  };
  const gotoSignup = (event) => {
    event.preventDefault();
    setState({ route: "/signup" });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address or Username"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link onClick={gotoSignup} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
