import React from "react";

export default function Loading({ message }) {
  return (
    <div className="loader-wrapper flex justify-content-center align-item-center">
      <div className="flex col">
        <div className="loader"></div>
        <h3 className="text-center">{message ? message : "loading..."}</h3>
      </div>
    </div>
  );
}
