import Button from "@mui/joy/Button";
import { MdDeleteForever } from "react-icons/md";
import React, { useState } from "react";

export default function KeywordButton({ children, keywordID, handleClick }) {
  const [hover, setHover] = useState(false);
  return (
    <Button
      id={"keyword-" + keywordID}
      style={{ margin: "4px" }}
      variant="outlined"
      color="neutral"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={() => handleClick(keywordID)}
    >
      {hover && <MdDeleteForever />}
      {children}
    </Button>
  );
}
