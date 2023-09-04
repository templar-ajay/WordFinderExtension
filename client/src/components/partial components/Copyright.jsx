import { Link, Typography } from "@mui/material";
import React from "react";

export default function Copyright() {
  return (
    <>
      <Typography
        className="w-100 absolute"
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ bottom: 5 }}
      >
        {"Copyright © "}
        <Link color="inherit" target="_blank" href="https://github.com/templar-ajay/">
          Our Website
        </Link>
        &nbsp;2023
      </Typography>
    </>
  );
}
