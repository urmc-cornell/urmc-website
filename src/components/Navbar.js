import React from "react";
import "../styles/bars.css";
import gold_logo from "../images/gold_logo.png";
import hamburgerIcon from "../images/assets/hamburger.svg";
import { useAuth } from "../contexts/AuthContext.js";

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

function ArrowIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Figma: gold Member Portal on the home page, outlined on other pages,
// and Sign Out on the portal itself. Member Portal goes straight to Google
// sign-in when signed out, and to the portal once signed in.
function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const path = window.location.pathname;

  if (path === '/profile') {
    return (
      <button
        type="button"
        // Hold the space until sign-in is confirmed; signed-out visitors are sent home.
        className={`nav-auth-btn nav-auth-btn--outline${user ? '' : ' nav-auth-btn--pending'}`}
        onClick={() => signOut().catch(err => console.error('Error updating sign-in:', err))}
      >
        Sign Out
      </button>
    );
  }

  const handlePortalClick = (e) => {
    if (user || loading) return;
    e.preventDefault();
    signInWithGoogle().catch(err => console.error('Error updating sign-in:', err));
  };

  return (
    <a href="/profile" onClick={handlePortalClick} className={`nav-auth-btn nav-auth-btn--${path === '/' ? 'gold' : 'outline'}`}>
      Member Portal <ArrowIcon />
    </a>
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

      {/* Logo */}
      <a href="/" className="nav-logo-link">
        <img src={gold_logo} className="site-logo" alt="URMC Logo" />
      </a>

      {/* Desktop links and member button */}
      <div className="nav-desktop">
        <NavLinks links={LINKS} className="nav-menu--desktop" />
        <AuthButton />
      </div>

      {/* Mobile slide-out menu */}
      <div id="mobile-navigation" className={clicked ? "nav-container active" : "nav-container"}>
        <NavLinks links={LINKS} className="nav-menu--mobile" />
        <div className="nav-auth--mobile">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
