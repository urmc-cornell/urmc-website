import { useScale } from '../hooks/useScale.js';
import studentsImg from '../images/getting-involved/students.jpg';
import companiesImg from '../images/getting-involved/companies.jpg';
import alumniImg from '../images/getting-involved/alumni.jpg';
import slackIcon from '../images/getting-involved/slack-icon.svg';
import instagramIcon from '../images/getting-involved/instagram-icon.svg';
import accenture from '../images/sponsors/accenture.png';
import bloomberg from '../images/sponsors/bloomberg.png';
import capitalone from '../images/sponsors/capital-one.png';
import datadog from '../images/sponsors/datadog.png';
import figma from '../images/sponsors/figma.png';
import ey from '../images/sponsors/ey.png';
import hrt from '../images/sponsors/hrt.png';
import janestreet from '../images/sponsors/jane-street.png';
import linkedin from '../images/sponsors/linkedin.png';
import roblox from '../images/sponsors/roblox.png';
import visa from '../images/sponsors/visa.png';
import '../styles/getting_involved.css';

const SLACK_URL = 'https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg';
const INSTAGRAM_URL = 'https://www.instagram.com/urmc_cornell';
const DONATE_URL = 'https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702';

const PARTNERS_ROW_1 = [
  { src: accenture, alt: 'Accenture' },
  { src: bloomberg, alt: 'Bloomberg' },
  { src: capitalone, alt: 'Capital One' },
  { src: datadog, alt: 'Datadog' },
];
const PARTNERS_ROW_2 = [
  { src: figma, alt: 'Figma' },
  { src: ey, alt: 'EY' },
  { src: hrt, alt: 'HRT' },
  { src: janestreet, alt: 'Jane Street' },
];
const PARTNERS_ROW_3 = [
  { src: linkedin, alt: 'LinkedIn' },
  { src: roblox, alt: 'Roblox' },
  { src: visa, alt: 'Visa' },
];

function PartnerTile({ src, alt }) {
  return (
    <div className="gi-partner-tile">
      <img src={src} alt={alt} />
    </div>
  );
}

function Hero() {
  return (
    <section className="gi-hero">
      <div className="gi-hero-content">
        <h1 className="gi-hero-title">Get Involved</h1>
        <p className="gi-hero-subtitle">
          Whether you're a student, alum, or company, there's a place for you in URMC.
        </p>
        <div className="gi-button-group">
          <button type="button" className="gi-btn gi-btn--gold">Support Us</button>
          <a href="/events" className="gi-btn gi-btn--outline-light">View Events</a>
        </div>
      </div>
    </section>
  );
}

function StudentsSection() {
  return (
    <section className="gi-section gi-section--light">
      <div className="gi-split-content">
        <div className="gi-text-block">
          <h2 className="gi-section-title gi-section-title--dark">Students</h2>
          <p className="gi-section-body gi-section-body--dark">
            Find out about URMC events, on-campus and off-campus opportunities,
            and other events happening within the CIS community!
          </p>
        </div>
        <div className="gi-button-group">
          <a href={SLACK_URL} target="_blank" rel="noreferrer" className="gi-btn gi-btn--outline-dark">
            <span>Join our Slack</span>
            <img src={slackIcon} alt="" className="gi-btn-icon" />
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="gi-btn gi-btn--outline-dark">
            <span>Follow Us</span>
            <img src={instagramIcon} alt="" className="gi-btn-icon" />
          </a>
        </div>
      </div>
      <div className="gi-split-image">
        <img src={studentsImg} alt="URMC students" />
      </div>
    </section>
  );
}

function CompaniesSection() {
  return (
    <section className="gi-section gi-section--dark gi-section--reverse">
      <div className="gi-split-image gi-split-image--tall">
        <img src={companiesImg} alt="URMC community event" />
      </div>
      <div className="gi-split-content gi-split-content--companies">
        <div className="gi-text-block">
          <h2 className="gi-section-title gi-section-title--light">Companies</h2>
          <p className="gi-section-body gi-section-body--light">
            Partner with URMC to connect with diverse, talented students in computing.
          </p>
        </div>
        <div className="gi-button-group gi-button-group--companies">
          <a href="mailto:urmc@cornell.edu" className="gi-btn gi-btn--light">Partner With Us</a>
          <a href="/sponsors" className="gi-btn gi-btn--outline-light">Our Sponsors</a>
        </div>
        <div className="gi-partners">
          <h3 className="gi-partners-title">Current Partners</h3>
          <div className="gi-partners-row">
            {PARTNERS_ROW_1.map((p) => <PartnerTile key={p.alt} {...p} />)}
          </div>
          <div className="gi-partners-row">
            {PARTNERS_ROW_2.map((p) => <PartnerTile key={p.alt} {...p} />)}
          </div>
          <div className="gi-partners-row gi-partners-row--short">
            {PARTNERS_ROW_3.map((p) => <PartnerTile key={p.alt} {...p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function AlumniSection() {
  return (
    <section className="gi-section gi-section--light">
      <div className="gi-split-content">
        <div className="gi-text-block">
          <h2 className="gi-section-title gi-section-title--dark">Alumni</h2>
          <p className="gi-section-body gi-section-body--dark">
            Stay connected with URMC through updates, events, and opportunities to support our community.
          </p>
        </div>
        <form className="gi-mailing-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="gi-mailing-input"
            aria-label="Email address"
          />
          <button type="submit" className="gi-btn gi-btn--dark">Join Mailing List</button>
        </form>
      </div>
      <div className="gi-split-image">
        <img src={alumniImg} alt="URMC alumni" />
      </div>
    </section>
  );
}

function SupportersSection() {
  return (
    <section className="gi-supporters">
      <h2 className="gi-supporters-title">Supporters</h2>
      <p className="gi-supporters-body">
        Support URMC in empowering underrepresented students in tech.
      </p>
      <div className="gi-button-group">
        <a href={DONATE_URL} target="_blank" rel="noreferrer" className="gi-btn gi-btn--gold">
          Donate
        </a>
        <button type="button" className="gi-btn gi-btn--outline-light">Learn More</button>
      </div>
    </section>
  );
}

export default function Getting_involved() {
  useScale();
  return (
    <div className="gi-page">
      <Hero />
      <StudentsSection />
      <CompaniesSection />
      <AlumniSection />
      <SupportersSection />
    </div>
  );
}
