import React, { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import axios from "axios";
import Error from "./components/Error.jsx";
import Loading from "./components/Loading.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";

function App() {
  const [User, setUser] = useState(null);
  const [State, setState] = useState({ route: "/" });

  useEffect(() => {
    setState({ route: "/loading" });
    axios
      .get(`http://localhost:4000/`)
      .then((response) => {
        setUser(response.data.data);
        setState({ route: "/" });
      })
      .catch((error) => {
        console.log(error);
        setState({ route: error.response?.status === 401 ? "/login" : "/error", error: error });
      });
  }, []);

  return {
    "/": <Home user={User} setState={setState} setUser={setUser} />,
    "/error": <Error setState={setState} error={State.error} />,
    "/loading": <Loading message={"...loading"} />,
    "/login": <Login setState={setState} setUser={setUser} />,
    "/signup": <SignUp setState={setState} setUser={setUser} />
  }[State.route];
}

export default App;
