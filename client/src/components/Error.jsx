import React from "react";
import { Link } from "@mui/material";

export default function Error({ error, setState }) {
  const gotoLogin = (event) => {
    event.preventDefault();
    setState({ route: "/" });
  };

  return (
    <div className="flex justify-content-center align-item-center col">
      {error.response ? (
        <>
          {"Error: " + error.response.data.message}
          <br />
          <Link onClick={gotoLogin} variant="body2">
            Go to Home Page
          </Link>
        </>
      ) : (
        "Server under development, please be patient."
      )}
    </div>
  );
}
