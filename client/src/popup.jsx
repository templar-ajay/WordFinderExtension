import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function Popup() {
  return (
    <>
      <App />
    </>
  );
}

const reactTarget = document.getElementById("react-target");
const root = createRoot(reactTarget);
root.render(<Popup />);
