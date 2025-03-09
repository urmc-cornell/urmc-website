import React from 'react';
import '../styles/bars.css';
import { useScale } from '../hooks/useScale.js';
import gold_logo from '../images/gold_logo.png'
import giving_day_banner from '../images/giving_day_banner.png';

function Navbar() {
    const [clicked, setClicked] = React.useState(false);
    useScale();

    const handleClick = () => {
        setClicked(!clicked);
    }

    return (
        <div>
            <div className='banner'>
                Giving Day Is Near, Donate
                <a 
                    href="https://givingday.cornell.edu/campaigns/under-represented-minorities-in-computing-urmc" 
                    target="_blank"
                    rel="noopener noreferrer"
                >
                Here!
                </a>
            </div>
            <nav className="nav">
                <a href="/">
                    <img src={gold_logo} className="site-logo" alt="URMC Logo" />
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

            {/* <div className='info-bar'>
                <div className='button-div'> 
                    <a class="info-btn" href="https://givingday.cornell.edu/campaigns/under-represented-minorities-in-computing-urmc" target="_blank">Giving Day!!</a> 
                </div>
            </div> */}
        </div>
    );
}

function CustomLink({ href, children, ...props }) {
  const path = window.location.pathname;

    return (
        <li className={path === href ? "active" : ""}>
            <a href={href} {...props}>
                {children}
            </a>
        </li>
    )
}

export default Navbar;