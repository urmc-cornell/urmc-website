import React from "react";
import "../styles/bars.css";
import gold_logo from "../images/gold_logo.png";
import hamburgerIcon from "../images/assets/hamburger.svg";

const LINKS = [
  { href: '/leadership', label: 'Who We Are' },
  { href: '/events', label: 'Events' },
  { href: '/getting-involved', label: 'Get Involved' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/ta-directory', label: 'TA Directory' },
  { href: '/points', label: 'Points' },
];

function NavLinks({ links, className }) {
  return (
    <ul className={`nav-menu ${className}`}>
      {links.map(({ href, label }) => (
        <li key={href} className={window.location.pathname === href ? 'active' : ''}>
          <a href={href} aria-current={window.location.pathname === href ? 'page' : undefined}>{label}</a>
        </li>
      ))}
    </ul>
  );
}

function Navbar() {
  const [clicked, setClicked] = React.useState(false);


  const handleClick = () => {
    setClicked(open => !open);
  };

  return (
    <nav className="nav">
      {/* Mobile hamburger */}
      <button type="button" className="menu-icon" onClick={handleClick} aria-label="Toggle menu" aria-expanded={clicked} aria-controls="mobile-navigation">
        {clicked ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="18" y2="18" stroke="#1f1f1f" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="18" y1="2" x2="2" y2="18" stroke="#1f1f1f" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <img src={hamburgerIcon} width="28" height="24" alt="" />
        )}
      </button>

      {/* Left links */}
      <NavLinks links={LINKS.slice(0, 3)} className="nav-menu--left" />

      {/* Center logo */}
      <a href="/" className="nav-logo-link">
        <img src={gold_logo} className="site-logo" alt="URMC Logo" />
      </a>

      {/* Right links */}
      <NavLinks links={LINKS.slice(3)} className="nav-menu--right" />

      {/* Mobile slide-out menu */}
      <div id="mobile-navigation" className={clicked ? "nav-container active" : "nav-container"}>
        <NavLinks links={LINKS} className="nav-menu--mobile" />
      </div>
    </nav>
  );
}

export default Navbar;
