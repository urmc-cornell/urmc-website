import React from 'react';
import '../styles/bars.css';
import { useScale } from '../hooks/useScale';

function Navbar() {
    const [clicked, setClicked] = React.useState(false);
    useScale();

    const handleClick = () => {
        setClicked(!clicked);
    }

    return (
        <nav className="nav">
            <a href="/">
                <img src={require('../images/gold_logo.png')} className="site-title" alt="URMC Logo" />
            </a>
            <div className="menu-icon" onClick={handleClick}>
                <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            <div className={clicked ? "nav-container active" : "nav-container"}>
                <ul className="nav-menu">
                    <CustomLink href="/leadership">LEADERSHIP</CustomLink>
                    <CustomLink href="/events">EVENTS</CustomLink>
                    <CustomLink href="/ta-directory">TA DIRECTORY</CustomLink>
                    <CustomLink href="/getting-involved">GETTING INVOLVED</CustomLink>
                    <CustomLink href="/sponsors">SPONSORS</CustomLink>
                    <CustomLink href="/points">POINTS</CustomLink>
                </ul>
            </div>
        </nav>
    );
}

function CustomLink({ href, children, ...props }) {
    const path = window.location.pathname

    return (
        <li className={path === href ? "active" : ""}>
            <a href={href} {...props}>
                {children}
            </a>
        </li>
    )
}

export default Navbar;