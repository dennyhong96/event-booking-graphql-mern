import React, { useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/authContext";
import "./Nvabar.css";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="main-navbar">
      <div className="main-navbar__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navbar__items">
        <ul>
          {!token && (
            <li>
              <NavLink exact to="/auth">
                Authenticate
              </NavLink>
            </li>
          )}
          <li>
            <NavLink exact to="/events">
              Events
            </NavLink>
          </li>
          {token && (
            <Fragment>
              <li>
                <NavLink exact to="/bookings">
                  Bookings
                </NavLink>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
