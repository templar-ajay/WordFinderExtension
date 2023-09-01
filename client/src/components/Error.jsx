import React from "react";

export default function Error({ error, setState }) {
  return (
    <div>
      {error.response
        ? "Error: " + error.response.data.message
        : "Server under development, please be patient."}
    </div>
  );
}
