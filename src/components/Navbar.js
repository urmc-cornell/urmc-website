export default function Navbar() {
    let Logo = require('../images/gold_logo.png');
    return <nav className="nav">
        <a href="/">
            <img src={Logo} className="site-title" href="/"></img>
        </a>
        <ul>
            <CustomLink href="/about-us">ABOUT US</CustomLink>
            <CustomLink href="/leadership">LEADERSHIP</CustomLink>
            <CustomLink href="/events">EVENTS</CustomLink>
            <CustomLink href="/ta-directory">TA DIRECTORY</CustomLink>
            <CustomLink href="/getting-involved">GETTING INVOLVED</CustomLink>
            <CustomLink href="/sponsors">SPONSORS</CustomLink>
        </ul>
    </nav>
}

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