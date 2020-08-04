import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/authContext";
import "./Nvabar.css";

const Navbar = () => {
  const { token } = useContext(AuthContext);

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
            <li>
              <NavLink exact to="/bookings">
                Bookings
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
