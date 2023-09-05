import React, { useEffect, useState } from "react";
import Home from "./components/Home.jsx";
import axios from "axios";
import Error from "./components/Error.jsx";
import Loading from "./components/Loading.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Copyright from "./components/partial components/Copyright.jsx";

function App() {
  const [User, setUser] = useState(null);
  const [State, setState] = useState({ route: "/", loading: false });

  useEffect(() => {
    setState((state) => {
      return { ...state, loading: true };
    });

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

  return (
    <>
      <div className="AppContainer">
        {{
          "/": <Home user={User} setState={setState} setUser={setUser} />,
          "/error": <Error setState={setState} error={State.error} />,
          "/login": <Login setState={setState} setUser={setUser} />,
          "/signup": <SignUp innerPath={"/"} setState={setState} setUser={setUser} />,
          "/signup/otp": (
            <SignUp innerPath={"/otp"} user={User} setState={setState} setUser={setUser} />
          )
        }[State.route] || <Error setState={setState} error={State.error} />}
      </div>
      {State.loading && <Loading message={"...loading"} />}
      <Copyright />
    </>
  );
}

export default App;
