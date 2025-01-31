import React, { useEffect } from 'react';
import academic from '../images/academic_icon.svg';
import community from '../images/community_icon.svg';
import profdev from '../images/prof_icon.svg';
import Carousel from '../components/Carousel.js';
import AboutUsPillarCard from '../components/AboutUsPillarCard.js';
import * as Constants from '../Supporting/AboutUsConstants.js';
import Widget from '../components/Widget.js';
import academic1 from '../images/sections/academic_1.png'  
import academic2 from '../images/sections/academic_2.png'  
import community1 from '../images/sections/community_1.png'  
import community2 from '../images/sections/community_2.png'  
import community3 from '../images/sections/community_3.png'  
import community4 from '../images/sections/community_4.png' 
import profdev1 from '../images/sections/prof_dev1.png' 
import profdev2 from '../images/sections/prof_dev2.png' 
import profdev3 from '../images/sections/prof_dev3.png' 
import { useScale } from '../hooks/useScale.js';
import '../styles/about_us.css';



// Component for individual pillar
const Pillar = ({ icon, text }) => (
  <div className="pillar">
    <img src={icon} className="pillar-icon" alt={`${text} icon`} />
    <div className="pillar-text">{text}</div>
  </div>
);

// Component for stats item
const StatsItem = ({ header, number }) => (
  <div className="stats-item">
    <div className="stats-header">{header}</div>
    <div className="stats-number">{number}</div>
  </div>
);

// Component for pillar section
const PillarSection = ({ title, children, imageSection, className }) => (
  <div className={`pillar-section ${className || ''}`}>
    {imageSection}
    <div className="section-content">
      <div className="section-title">{title}</div>
      <div className="section-text">{children}</div>
    </div>
  </div>
);

function About_us() {

  useScale();
  
  return (
    <main className="about-us-page">
      <section className="about-us">
        <h1 className="about-header">About Us</h1>
        <h2 className="purpose">
          The purpose of Underrepresented Minorities in Computing is to promote diversity
          within the computing fields and foster an environment that empowers{' '}
          <span className="purpose-bolded">black</span>,{' '}
          <span className="purpose-bolded">latinx</span>, and{' '}
          <span className="purpose-bolded">indigenous</span> students with technological
          aspirations through <span className="purpose-bolded">3 pillars:</span>
        </h2>
      </section>

      <section className="pillars">
        <Pillar icon={academic} text="Academic Support" />
        <Pillar icon={community} text="Community Building" />
        <Pillar icon={profdev} text="Professional Development" />
      </section>

      <section className="pillar-sections">
        <PillarSection 
          title="Academic Support"
          imageSection={
            <div className="academic-images">
              <img src={academic1} id="academic-1" alt="Academic support 1" />
              <img src={academic2} id="academic-2" alt="Academic support 2" />
            </div>
          }
        >
          <p>Our wonderful academic chairs work to uphold and facilitate academic success by:</p>
          <ul>
            <li>Creating and overseeing class Slack channels for all CS classes</li>
            <li>Regularly hosting office hours</li>
            <li>Preparing and hosting prelim review sessions</li>
            <li>Collaborating with class TAs and maintaining TA database</li>
          </ul>
        </PillarSection>

        <PillarSection className="reverse"
          title="Community Building"
          imageSection={
            <div className="community-images">
              <img src={community1} id="community-1" alt="Community building 1" />
              <img src={community2} id="community-2" alt="Community building 2" />
              <img src={community3} id="community-3" alt="Community building 3" />
              <img src={community4} id="community-4" alt="Community building 4" />
            </div>
          }
        >
          <p>Outreach, Mentorship, and Social puts all their efforts into strengthening our community by</p>
          <ul>
            <li>Facilitating our M&M Mentorship Program</li>
            <li>Planning and hosting social events like movies, bowling, picnics, etc.</li>
            <li>Hosting general body meetings for peer discussion and bonding</li>
            <li>Collaborating with clubs like NSBE and SHPE to expand our community reach</li>
          </ul>
        </PillarSection>

        <PillarSection 
          title="Professional Development"
          imageSection={
            <div className="profdev-images">
              <img src={profdev1} id="profdev-1" alt="Professional development 1" />
              <img src={profdev2} id="profdev-2" alt="Professional development 2" />
              <img src={profdev3} id="profdev-3" alt="Professional development 3" />
            </div>
          }
        >
          <p>Our amazing professional development and corporate chairs work to promote professional excellence by</p>
          <ul>
            <li>Hosting technical and behavioral mock interviews</li>
            <li>Hosting company recruitment events with sponsors</li>
            <li>Hosting resume review sessions</li>
            <li>Maintaining and sending resumé book to our sponsors</li>
          </ul>
        </PillarSection>
      </section>

      <section className="stats-bar">
        <StatsItem header="FOUNDED" number="2016" />
        <StatsItem header="ACTIVE MEMBERS" number="150+" />
        <StatsItem header="SPONSORS" number="9" />
      </section>

      <section className="join-section">
        <h2 id="join-header">Like What You See?</h2>
        <div id="join-button">
          <a 
            id="join-text" 
            href="https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg" 
            target="_blank"
            rel="noopener noreferrer"
          >
            JOIN THE COMMUNITY
          </a>
        </div>
      </section>
    </main>
  );
}

export default About_us;
