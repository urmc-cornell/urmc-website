import React from "react";
import "../styles/bars.css";
import { useScale } from "../hooks/useScale.js";
import gold_logo from "../images/gold_logo.png";

function Navbar() {
  const [clicked, setClicked] = React.useState(false);
  useScale();

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="nav">
      {/* Mobile hamburger */}
      <div className="menu-icon" onClick={handleClick} aria-label="Toggle menu">
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>

      {/* Left links */}
      <ul className="nav-menu nav-menu--left">
        <CustomLink href="/leadership">Who We Are</CustomLink>
        <CustomLink href="/events">Events</CustomLink>
        <CustomLink href="/getting-involved">Get Involved</CustomLink>
      </ul>

      {/* Center logo */}
      <a href="/" className="nav-logo-link">
        <img src={gold_logo} className="site-logo" alt="URMC Logo" />
      </a>

      {/* Right links */}
      <ul className="nav-menu nav-menu--right">
        <CustomLink href="/sponsors">Sponsors</CustomLink>
        <CustomLink href="/ta-directory">TA Directory</CustomLink>
        <CustomLink href="/points">Points</CustomLink>
      </ul>

      {/* Mobile slide-out menu */}
      <div className={clicked ? "nav-container active" : "nav-container"}>
        <ul className="nav-menu nav-menu--mobile">
          <CustomLink href="/leadership">Who We Are</CustomLink>
          <CustomLink href="/events">Events</CustomLink>
          <CustomLink href="/getting-involved">Get Involved</CustomLink>
          <CustomLink href="/sponsors">Sponsors</CustomLink>
          <CustomLink href="/ta-directory">TA Directory</CustomLink>
          <CustomLink href="/points">Points</CustomLink>
        </ul>
      </div>
    </nav>
  );
}

function CustomLink({ href, children, ...props }) {
  const path = window.location.pathname;
  return (
    <li className={path === href ? "active" : ""}>
      <a href={href} {...props}>{children}</a>
    </li>
  );
}

export default Navbar;
