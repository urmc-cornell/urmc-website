import gold_logo from '../images/gold_logo.png';
import mail from '../images/assets/mail.png';
import instagram from '../images/assets/instagram.png';
import facebook from '../images/assets/facebook.png';
import linkedin from '../images/assets/linkedIn.png';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div className="footer-brand">
          <a href="/">
            <img src={gold_logo} alt="URMC Logo" className="footer-logo" />
          </a>
          <p className="footer-tagline">
            Building a supportive community for Black, Latinx, and Indigenous students since 2016
          </p>
          <div className="footer-socials">
            <a href="mailto:urmc@cornell.edu" aria-label="Email">
              <img src={mail} alt="" className="footer-social-icon" />
            </a>
            <a href="https://www.instagram.com/urmc_cornell/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={instagram} alt="" className="footer-social-icon" />
            </a>
            <a href="https://www.facebook.com/cornellurmc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={facebook} alt="" className="footer-social-icon" />
            </a>
            <a href="https://www.linkedin.com/company/urmc-cornell/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={linkedin} alt="" className="footer-social-icon" />
            </a>
          </div>
          <a href="/getting-involved" className="footer-cta">Join the Community</a>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="footer-nav-col">
            <h3 className="footer-nav-heading">Explore</h3>
            <ul className="footer-nav-list">
              <li><a href="/">Home</a></li>
              <li><a href="/about-us">About</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/getting-involved">Get Involved</a></li>
              <li><a href="/events">10-Year Anniversary</a></li>
            </ul>
          </div>
          <div className="footer-nav-col">
            <h3 className="footer-nav-heading">Resources &amp; Opportunities</h3>
            <ul className="footer-nav-list">
              <li><a href="/ta-directory">TA Directory</a></li>
              <li><a href="/points">Points</a></li>
              <li><a href="/sponsors">Sponsors</a></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <p className="footer-legal">
          Underrepresented Minorities in Computing is a registered student organization of Cornell
          University and an affiliate of{' '}
          <a href="https://www.colorstack.org/" target="_blank" rel="noopener noreferrer">
            ColorStack
          </a>.
        </p>
        <p className="footer-legal footer-legal--italic">
          With a founding principle of &ldquo;&hellip; any person &hellip; any study,&rdquo; Cornell is an{' '}
          <a
            href="https://hr.cornell.edu/about/workplace-rights/equal-education-and-employment-opportunity-statement"
            target="_blank"
            rel="noopener noreferrer"
          >
            equal opportunity employer and educator.
          </a>
        </p>
      </div>
    </footer>
  );
}
