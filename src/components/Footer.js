export default function Footer() {
    let mail = require('../images/assets/mail.png');
    let facebook = require('../images/assets/facebook.png');
    let instagram = require('../images/assets/instagram.png');
    let linkedin = require('../images/assets/linkedIn.png');

    return <nav className="foot">
        <h1 className="footer-title">Underrepresented Minorities in Computing</h1>
        <ul>
            <li>
                <a href="/">
                    <img src={mail} className="socials" href=""></img>
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com/urmc_cornell/" target="_blank">
                    <img src={instagram} className="socials" href="/"></img>
                </a>
            </li>
            <li>
                <a href="https://www.linkedin.com/company/urmc-cornell/" target="_blank">
                    <img src={linkedin} className="socials" href=""></img>
                </a>
            </li>
            <li>
                <a href="https://www.facebook.com/cornellurmc" target="_blank">
                    <img src={facebook} className="socials" href="/"></img>
                </a>
            </li>
        </ul>
    </nav>
}

