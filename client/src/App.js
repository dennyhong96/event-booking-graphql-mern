import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthContext from "./context/authContext";
import Navbar from "./componnets/navigation/Navbar";
import Auth from "./componnets/pages/Auth";
import Events from "./componnets/pages/Events";
import Bookings from "./componnets/pages/Bookings";
import "./App.css";

function App() {
  const [state, setState] = useState({ token: null, userId: null });
  const { token, userId } = state;
  const login = (token, userId, tokenExpiration) => {
    setState({ token, userId });
  };
  const logout = () => {
    setState({ token: null, userId: null });
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, logout, login }}>
        <Navbar />
        <main className="main-content">
          <Switch>
            {!token && <Redirect exact from="/" to="/auth" />}
            {!token && <Route exact path="/auth" component={Auth} />}
            <Route exact path="/events" component={Events} />
            {token && <Route exact path="/bookings" component={Bookings} />}
            {!token && <Redirect exact from="/bookings" to="/auth" />}
            {token && <Redirect exact from="/" to="/events" />}
            {token && <Redirect exact from="/auth" to="/events" />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
