import React from "react";

export default function Error({ error, setState }) {
  return <div>Error: {error.response.data.message}</div>;
}
