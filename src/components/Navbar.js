import React, { Component } from "react";
import goldLogo from "../images/gold_logo.png";
import "../styles/bars.css";

class Navbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render(props) {
    return (
      <nav className="nav">
        <a href="/">
          <img src={goldLogo} className="site-title" href="/"></img>
        </a>
        <div className="menu-icon" onClick={this.handleClick}>
          <i
            className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}
          ></i>
        </div>
        <div
          className={
            this.state.clicked ? "nav-container active" : "nav-container"
          }
        >
          <ul className="nav-menu">
            <CustomLink href="/about-us">ABOUT US</CustomLink>
            <CustomLink href="/leadership">LEADERSHIP</CustomLink>
            {/* <CustomLink href="/events">EVENTS</CustomLink> */}
            <CustomLink href="/ta-directory">TA DIRECTORY</CustomLink>
            <CustomLink href="/getting-involved">GETTING INVOLVED</CustomLink>
            <CustomLink href="/sponsors">SPONSORS</CustomLink>
            <CustomLink href="/points">POINTS</CustomLink>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;

function CustomLink({ href, children, ...props }) {
  const path = window.location.pathname;

  return (
    <li className={path == href ? "active" : ""}>
      <a href={href} {...props}>
        {children}
      </a>
    </li>
  );
}
