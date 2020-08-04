import React from "react";
import { NavLink } from "react-router-dom";

import "./Nvabar.css";

const Navbar = () => {
  return (
    <header className="main-navbar">
      <div className="main-navbar__logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navbar__items">
        <ul>
          <li>
            <NavLink exact to="/auth">
              Authenticate
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/events">
              Events
            </NavLink>
          </li>
          <li>
            <NavLink exact to="/bookings">
              Bookings
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
