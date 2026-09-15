import RedesignHero from '../components/RedesignHero.js';
import PartnershipButton from '../components/PartnershipButton.js';
import afrotech from '../images/sponsors/afrotech.jpg';
import externalLink from '../images/sponsors/external-link.svg';
import linkedin from '../images/sponsors/linkedin.png';
import janestreet from '../images/sponsors/jane-street.png';
import visa from '../images/sponsors/visa.png';
import bloomberg from '../images/sponsors/bloomberg.png';
import hrt from '../images/sponsors/hrt.png';
import accenture from '../images/sponsors/accenture.png';
import datadog from '../images/sponsors/datadog.png';
import roblox from '../images/sponsors/roblox.png';
import capitalone from '../images/sponsors/capital-one.png';
import ey from '../images/sponsors/ey.png';
import figma from '../images/sponsors/figma.png';
import '../styles/sponsors.css';

const SPONSOR_TIERS = [
  { name: 'Platinum', sponsors: [{ name: 'LinkedIn', image: linkedin, id: 'linkedin' }] },
  { name: 'Gold', sponsors: [{ name: 'Jane Street', image: janestreet, id: 'jane-street' }] },
  { name: 'Silver', sponsors: [
    { name: 'Visa', image: visa, id: 'visa' },
    { name: 'Bloomberg', image: bloomberg, id: 'bloomberg' },
    { name: 'Hudson River Trading', image: hrt, id: 'hrt' },
    { name: 'Accenture', image: accenture, id: 'accenture' },
  ] },
  { name: 'Bronze', sponsors: [
    { name: 'Datadog', image: datadog, id: 'datadog' },
    { name: 'Roblox', image: roblox, id: 'roblox' },
    { name: 'Capital One', image: capitalone, id: 'capital-one' },
    { name: 'EY', image: ey, id: 'ey' },
    { name: 'Figma', image: figma, id: 'figma' },
  ] },
];

export default function Sponsors() {

  return (
    <main className="redesign-page sponsors-page">
      <RedesignHero title="Our Sponsors" description="Our corporate partners help expand access to opportunities for underrepresented students in tech, while gaining direct access to a talented and diverse community." image={afrotech} imageAlt="URMC members at the AfroTech Conference" className="sponsors-hero">
        <PartnershipButton className="redesign-button redesign-button--gold">Become a Partner<img src={externalLink} alt="" /></PartnershipButton>
        <a href="mailto:urmc@cornell.edu" className="redesign-button">Contact Us</a>
      </RedesignHero>
      <section className="corporate-sponsors" aria-labelledby="corporate-sponsors-title">
        <h2 id="corporate-sponsors-title" className="redesign-section-title">2026 Corporate Sponsors</h2>
        <div className="corporate-sponsor-tiers">
          {SPONSOR_TIERS.map(tier => (
            <section key={tier.name} className={`corporate-sponsor-tier corporate-sponsor-tier--${tier.name.toLowerCase()}`} aria-labelledby={`tier-${tier.name}`}>
              <div className="corporate-tier-heading"><h3 id={`tier-${tier.name}`}>{tier.name}</h3></div>
              <div className="corporate-sponsor-cards">
                {tier.sponsors.map(sponsor => <div className={`corporate-sponsor-card corporate-sponsor-card--${sponsor.id}`} key={sponsor.id}><img src={sponsor.image} alt={sponsor.name} loading="lazy" /></div>)}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
