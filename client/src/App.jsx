import React, { useState, useEffect } from "react";
import Switch from "@mui/joy/Switch";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Box as JoyBox } from "@mui/joy/";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";
import { MdOutlineSearch } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import synonyms from "synonyms";
import KeywordButton from "./components/partial components/KeywordButton.jsx";
import { sendMessage, getKeywords, saveKeywords } from "./helpers/ChromeHelpers.js";

const levels = [
  {
    value: 0,
    label: "low"
  },
  {
    value: 50,
    label: "medium"
  },
  {
    value: 100,
    label: "high"
  }
];

function App() {
  const [synonymsEnabled, setSynonymsEnabled] = useState(false);
  const [synonymsLevel, setSynonymsLevel] = useState(0);
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(["keywords"], function (result) {
      const { keywords } = result ? result : { keywords: [] };
      // Use the retrieved values
      console.log("retrieved keywords from app.jsx", keywords);
      setKeywords(keywords);
    });
  }, []);
  // save and sync keywords in local storage
  useEffect(() => {
    (async () => {
      if ((await getKeywords()) !== keywords) {
        console.log("saving keywords", keywords);
        saveKeywords(keywords);
      }
    })();
  }, [keywords]);

  const handleChange = (event) => setSynonymsEnabled(event.target.checked);

  const handleSynonymsLevelChange = (event) => setSynonymsLevel(event.target.value);

  const handleTextAreaInput = (event) => {
    const inputValue = event.target.value;
    if (
      inputValue.includes(",") &&
      inputValue.length > 2 &&
      (inputValue[inputValue.length - 2] != "," || true)
    ) {
      const theKeyword = inputValue.split(",")[0].trim();

      if (!synonymsEnabled) {
        /**
      add single keyword
      */
        addKeyword({
          id: Math.random() * 1000000,
          keyword: theKeyword
        });
      } else {
        /**
        add keyword and it's synonyms
        */
        console.log("imported synonyms module", synonyms);
        console.log(`theKeyword`, theKeyword);

        let num_synonyms = 3;
        if (synonymsLevel == 50) {
          num_synonyms = 5;
        } else if (synonymsLevel == 100) {
          num_synonyms = 10000000;
        }
        const theSynonymsSet = getSynonyms(theKeyword, num_synonyms);

        console.log("theSynonymsSet", theSynonymsSet);

        addKeywords(Array.from(theSynonymsSet));
      }

      //
      setText("");
    } else if (inputValue.includes(",")) {
      setText("");
    } else setText(inputValue);
  };

  function deleteKeyword(id) {
    setKeywords([...keywords.filter((x) => (x.id != id ? true : false))]);
  }

  function addKeyword(keyword = { id: 3, keyword: "new" }) {
    if (!keywords.find((x) => x.id === keyword?.id || x.keyword === keyword.keyword)) {
      setKeywords([...keywords, keyword]);
    }
  }

  function addKeywords(_keywords) {
    // purge duplicate keywords
    const keywordsArray = _keywords.map((k) => {
      return { id: Math.random() * 1000000, keyword: k };
    });
    const filteredKeywords = keywordsArray.filter(
      (k) => !keywords.some((x) => x.keyword == k.keyword || x.id == k.id)
    );
    console.log("filteredKeywords", filteredKeywords);

    console.log("keywordsArray", filteredKeywords);
    setKeywords([...keywords, ...filteredKeywords]);
  }

  function handleSearch() {
    if (keywords.length) {
      sendMessage("clearSearch");
      sendMessage(
        "search",
        keywords.map((x) => x.keyword)
      );
    }
  }

  function handleClearSearch() {
    sendMessage("clearSearch");
  }

  function handlePrevious() {
    sendMessage("moveHighlighted", "previous");
    console.log("previous clicked");
  }

  function handleNext() {
    sendMessage("moveHighlighted", "next");
    console.log("next clicked");
  }

  return (
    <>
      <div id="synonyms-div" className="flex row">
        <Box
          sx={{
            width: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start"
          }}
        >
          <label
            style={{
              marginBottom: "10px",
              alignSelf: "center"
            }}
          >
            Synonyms {synonymsEnabled ? "Enabled" : "Disabled"}
          </label>
          <Switch checked={synonymsEnabled} onChange={handleChange} />
        </Box>

        <Box sx={{ width: 120 }}>
          <label>Select Synonym Level</label>
          <Slider
            aria-label="Always visible"
            value={synonymsLevel}
            getAriaValueText={valueText}
            step={50}
            marks={levels}
            valueLabelDisplay="off"
            onChange={handleSynonymsLevelChange}
            disabled={!synonymsEnabled}
          />
        </Box>
      </div>
      <div id="keywords-div" className="row">
        <Textarea
          minRows={1}
          maxRows={2}
          placeholder="Type your keywords here..."
          value={text}
          onChange={handleTextAreaInput}
          endDecorator={
            <JoyBox sx={{ display: "flex-inline", gap: 0.5 }}>
              {(keywords ? keywords : []).map((keyword) => (
                <KeywordButton key={keyword.id} keywordID={keyword.id} handleClick={deleteKeyword}>
                  {keyword.keyword}
                </KeywordButton>
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
      <div id="search-&-Navigate" className="row flex flex-edges">
        <div id="search">
          <Button
            size="small"
            variant="outlined"
            onClick={handleSearch}
            style={{ borderRadius: "10px 0 0 10px" }}
          >
            <MdOutlineSearch size={"1.4rem"} style={{ marginRight: "4px", marginTop: "2px" }} />
            Search
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleClearSearch}
            style={{ borderRadius: "0 10px 10px 0" }}
          >
            <AiOutlineClear size={"1.4rem"} style={{ marginRight: "4px", marginTop: "2px" }} />
            clear
          </Button>
        </div>
        <div id="navigate" className="flex">
          <Button
            size="small"
            className="nav-button"
            id="find-prev"
            variant="outlined"
            style={{ borderRadius: "10px 0 0 10px" }}
            onClick={handlePrevious}
          >
            <MdKeyboardArrowLeft size={"1.4rem"} style={{ marginRight: "4px", marginTop: "2px" }} />
            Back
          </Button>
          <Button
            size="small"
            id="find-next"
            className="nav-button"
            variant="outlined"
            style={{ borderRadius: "0 10px 10px 0" }}
            onClick={handleNext}
          >
            Next
            <MdKeyboardArrowRight size={"1.4rem"} style={{ marginLeft: "4px", marginTop: "2px" }} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
