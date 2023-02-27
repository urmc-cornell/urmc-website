import Button from 'react-bootstrap/Button';
import React, { Component } from 'react'
import '../styles/bars.css'

class Navbar extends Component {
// export default function Navbar() {

    state = {clicked: false}

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
        console.log(this.state.clicked)
    }

    render() {
    return <nav className="nav">
        <a href="/">
            <img src={require('../images/gold_logo.png')} className="site-title" href="/"></img>
        </a>

        <div className="menu-icon" onClick={this.handleClick}>
            <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>

        </div>

        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
            <CustomLink href="/about-us">ABOUT US</CustomLink>
            <CustomLink href="/leadership">LEADERSHIP</CustomLink>
            <CustomLink href="/events">EVENTS</CustomLink>
            <CustomLink href="/ta-directory">TA DIRECTORY</CustomLink>
            <CustomLink href="/getting-involved">GETTING INVOLVED</CustomLink>
            <CustomLink href="/sponsors">SPONSORS</CustomLink>
        </ul>
    </nav>
    }
}

export default Navbar

function CustomLink({href, children, ...props}) {
    const path = window.location.pathname

    return (
        <li className={path == href ? "active" : ""}>
            <a href={href} {...props}>
                {children}
            </a>
        </li>
    )
}