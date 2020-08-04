import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

import AuthContext from "./context/authContext";
import Navbar from "./componnets/navigation/Navbar";
import Auth from "./componnets/pages/Auth";
import Events from "./componnets/pages/Events";
import Bookings from "./componnets/pages/Bookings";
import "./App.css";

function App() {
  useEffect(() => {
    if (localStorage.getItem("jwt") && localStorage.getItem("userId")) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwt")}`;
      setState({
        token: localStorage.getItem("jwt"),
        userId: localStorage.getItem("userId"),
      });
    }
  }, []);

  const [state, setState] = useState({ token: null, userId: null });
  const { token, userId } = state;
  const login = (token, userId, tokenExpiration) => {
    localStorage.setItem("jwt", token);
    localStorage.setItem("userId", userId);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setState({ token, userId });
  };
  const logout = () => {
    localStorage.removeItem("jwt", token);
    localStorage.removeItem("userId", userId);
    setState({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, logout, login }}>
        <Navbar />
        <main className="main-content">
          <Switch>
            {!token && <Route exact path="/auth" component={Auth} />}
            <Route exact path="/events" component={Events} />
            {token && <Route exact path="/bookings" component={Bookings} />}
            {!token && <Redirect exact from="/bookings" to="/auth" />}
            {token && <Redirect exact from="/" to="/events" />}
            {token && <Redirect exact from="/auth" to="/events" />}
            {!token && <Redirect exact to="/auth" />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
