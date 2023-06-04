import React, { useState } from "react";
import Switch from "@mui/joy/Switch";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Box as JoyBox } from "@mui/joy/";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import { MdDeleteForever } from "react-icons/md";
import { MdOutlineSearch } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const levels = [
  {
    value: 0,
    label: "low",
  },
  {
    value: 50,
    label: "medium",
  },
  {
    value: 100,
    label: "high",
  },
];

function valueText(value) {
  if (value == 1) {
    return "low";
  } else if (value == 2) {
    return "medium";
  } else if (value == 3) {
    return "high";
  }
}

function App() {
  const [synonyms, setSynonyms] = useState(false);
  const handleChange = (event) => {
    setSynonyms(event.target.checked);
  };

  const [text, setText] = useState("");
  const addEmoji = (emoji) => () => setText(`${text}${emoji}`);

  const [keywords, setKeywords] = useState([
    { id: 1, keyword: "hello", hover: false },
    { id: 2, keyword: "hi", hover: false },
  ]);
  function setHover(id, boolean) {
    setKeywords([
      ...keywords.map((x) =>
        x.id == id ? { ...x, hover: boolean } : { ...x, hover: false }
      ),
    ]);
  }
  function deleteKeyword(id) {
    setKeywords([...keywords.filter((x) => (x.id != id ? true : false))]);
  }
  function addKeyword(keyword = { id: 3, keyword: "new", hover: false }) {
    if (!keywords.find((x) => x.id === keyword?.id)) {
      setKeywords([...keywords, keyword]);
    }
  }

  return (
    <>
      <div id="synonyms-div" className="flex row">
        <Box
          sx={{
            width: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <label
            style={{
              marginBottom: "10px",
              alignSelf: "center",
            }}
          >
            Synonyms {synonyms ? "Enabled" : "Disabled"}
          </label>
          <Switch
            checked={synonyms}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Box>

        <Box sx={{ width: 120 }}>
          <label>Select Synonym Level</label>
          <Slider
            aria-label="Always visible"
            defaultValue={0}
            getAriaValueText={valueText}
            step={50}
            marks={levels}
            valueLabelDisplay="off"
            disabled={!synonyms}
          />
        </Box>
      </div>
      <div id="keywords-div" className="row">
        <Textarea
          placeholder="Type your keywords here..."
          value={text}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (
              inputValue.includes(",") &&
              inputValue.length > 2 &&
              (inputValue[inputValue.length - 2] != "," || true)
            ) {
              const theKeyword = inputValue.split(",")[0].trim();
              addKeyword({
                id: Math.random() * 100000,
                keyword: theKeyword,
                hover: false,
              });
              setText("");
            } else if (inputValue.includes(",")) {
              setText("");
            } else setText(inputValue);
          }}
          minRows={2}
          maxRows={4}
          endDecorator={
            <JoyBox sx={{ display: "flex-inline", gap: 0.5 }}>
              {keywords.map((keyword) => (
                <Button
                  key={keyword.id}
                  style={{
                    margin: "4px",
                  }}
                  id={"keyword-" + keyword.id}
                  variant="outlined"
                  color="neutral"
                  onMouseOver={() => setHover(keyword.id, true)}
                  onMouseOut={() => setHover(keyword.id, false)}
                  onClick={() => {
                    deleteKeyword(keyword.id);
                  }}
                >
                  {keyword.hover && <MdDeleteForever />}
                  {"  "} {keyword.keyword}
                </Button>
              ))}
            </JoyBox>
          }
          startDecorator={
            <Typography level="body1" sx={{ m: "auto" }}>
              Enter keywords separated by a comma{" "}
              <Typography style={{ color: "grey" }}>(</Typography>
              {" , "}
              <Typography style={{ color: "grey" }}>)</Typography>
            </Typography>
          }
          sx={{ minWidth: 300 }}
        />
      </div>
      <div id="search-&-Navigate" className="row flex">
        <div id="search">
          <Button variant="outlined">
            <MdOutlineSearch
              size={"1.4rem"}
              style={{ marginRight: "4px", marginTop: "2px" }}
            />
            Search
          </Button>
        </div>
        <div id="navigate" className="flex">
          <Button className="nav-button" variant="outlined">
            <MdKeyboardArrowLeft
              size={"1.4rem"}
              style={{ marginRight: "4px", marginTop: "2px" }}
            />
            Back
          </Button>
          <Button className="nav-button" variant="outlined">
            Next
            <MdKeyboardArrowRight
              size={"1.4rem"}
              style={{ marginLeft: "4px", marginTop: "2px" }}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
export default App;

/*
  <IconButton
                variant="outlined"
                color="neutral"
                onClick={addEmoji("👍")}
              >
                👍
              </IconButton>
              <IconButton
                variant="outlined"
                color="neutral"
                onClick={addEmoji("🏖")}
              >
                🏖
              </IconButton>
              <IconButton
                variant="outlined"
                color="neutral"
                onClick={addEmoji("😍")}
              >
                😍
              </IconButton>
}
*/

// function spacing(num) {
//   return <> </>;
// }
