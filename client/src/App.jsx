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
    const token = document.cookie.authToken;
    setState({ route: "/loading" });
    axios
      .get(`http://localhost:4000/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`
        }
      })
      .then((response) => {
        setUser(response.data);
        setState({ route: "/" });
      })
      .catch((error) => {
        console.log(error);
        setState({ route: error.response.status === 401 ? "/login" : "/error", error: error });
      });
  }, []);

  return {
    "/": <Home user={User} setState={setState} />,
    "/error": <Error setState={setState} error={State.error} />,
    "/loading": <Loading message={"...loading"} />,
    "/login": <Login setState={setState} />,
    "/signup": <SignUp setState={setState} />
  }[State.route];
}

export default App;
