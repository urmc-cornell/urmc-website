  import heart from "../images/assets/heart.png";
import mail from "../images/assets/mail.png";
import facebook from "../images/assets/facebook.png";
import instagram from "../images/assets/instagram.png";
import linkedin from "../images/assets/linkedIn.png";

export default function Footer() {
  return (
    <nav className="foot">
      <div className="footer-text">
        <h1 className="footer-title">
          UNDERREPRESENTED MINORITIES IN COMPUTING
        </h1>
        <div className="footer-subtitle">
          <img className="heart" src={heart}></img>
          <h2 className="footer-subtitle-text">
            CURRENTLY THRIVING IN ITHACA, NEW YORK.
          </h2>
        </div>
        <div className="footer-subtitle">
          {/* <img className="heart" src={heart}></img> */}
          <h2 className="footer-subtitle-text">
            This organization is a registered student organization of Cornell
            University.
          </h2>
        </div>
      </div>

      <ul>
        <li>
          <a href="mailto:urmc@cornell.edu">
            <img src={mail} className="socials" href=""></img>
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/urmc_cornell/" target="_blank">
            <img src={instagram} className="socials" href="/"></img>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/company/urmc-cornell/"
            target="_blank"
          >
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
  );
}
