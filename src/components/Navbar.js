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
      <button className="menu-icon" onClick={handleClick} aria-label="Toggle menu">
        {clicked ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="18" y2="18" stroke="#eeb50c" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="18" y1="2" x2="2" y2="18" stroke="#eeb50c" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="1" x2="22" y2="1" stroke="#eeb50c" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="8" x2="22" y2="8" stroke="#eeb50c" strokeWidth="2" strokeLinecap="round"/>
            <line x1="0" y1="15" x2="22" y2="15" stroke="#eeb50c" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

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
