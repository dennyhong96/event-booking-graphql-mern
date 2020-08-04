import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Auth from "./componnets/pages/Auth";
import Events from "./componnets/pages/Events";
import Bookings from "./componnets/pages/Bookings";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/auth" />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/events" component={Events} />
        <Route exact path="/bookings" component={Bookings} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
