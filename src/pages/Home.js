import { useEffect } from 'react';
import group from '../images/urmcfa2024.png';
import blue_ellipse from '../images/blue_ellipse.png';
import purple_ellipse from '../images/purple_ellipse.png';
import About_us from './About_us.js';
import { useScale } from '../hooks/useScale.js';
import gold_logo from '../images/gold_logo.png'

export default function Home() {

    useScale()

    return <home className="home">

        <nav className="home-nav">
            <a href="/" >
                <img src={gold_logo} alt="URMC Logo" className="home-logo"/>
            </a>
            <ul className="home-nav-menu">
                <li><a href="/leadership">LEADERSHIP</a></li>
                <li><a href="/events">EVENTS</a></li>
                <li><a href="/ta-directory">TA DIRECTORY</a></li>
                <li><a href="/getting-involved">GETTING INVOLVED</a></li>
                <li><a href="/sponsors">SPONSORS</a></li>
                <li><a href="/points">POINTS</a></li>
            </ul>
        </nav>

        <div className="home-content">
            <h1 className="header">UNDERREPRESENTED MINORITIES IN</h1>
            <h2 className="header bottom">COMPUTING</h2>
            <h2 className="sub-header">Building a supportive community where all can find success.</h2>
        </div>

        <div className="images">
            <img src={blue_ellipse} className="blue_ellipse"></img>
            <img src={purple_ellipse} className="purple_ellipse"></img>
            <img src={group} className="group"></img>
        </div>

        <About_us></About_us>
        
    </home>

    
}
