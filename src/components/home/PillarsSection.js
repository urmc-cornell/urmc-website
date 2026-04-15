import { useState } from 'react';
import academicImg from '../../images/home/pillar-academic.jpg';
import profdevImg from '../../images/home/pillar-profdev.jpg';
import communityImg from '../../images/home/pillar-community.jpg';
import '../../styles/pillars.css';

const pillars = [
  {
    id: 'academic',
    title: 'Academic Support',
    image: academicImg,
    description: 'We support academic success in computing courses through collaborative resources and structured guidance.',
    bullets: [
      'Slack channels for academic help',
      'Office hours and peer support',
      'Prelim review sessions',
      'TA connections and resource database',
    ],
  },
  {
    id: 'profdev',
    title: 'Professional Development',
    image: profdevImg,
    description: 'We prepare members to succeed in the tech industry with hands-on career support and opportunities.',
    bullets: [
      'Company-sponsored recruitment events',
      'Technical and behavioral mock interviews',
      'Resume reviews and curated resume book',
      'Semesterly professional headshots',
    ],
  },
  {
    id: 'community',
    title: 'Community Building',
    image: communityImg,
    description: 'We foster a strong, supportive community where members connect, grow, and belong.',
    bullets: [
      'M&M Mentorship Program',
      'Social events and general body meetings',
      'Peer connection and community spaces',
      'Partnerships with organizations like NSBE and SHPE',
    ],
  },
];

function PillarCard({ pillar }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`pillar-card pillar-card--${pillar.id}${active ? ' pillar-card--active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <img src={pillar.image} alt={pillar.title} />
      <div className="pillar-card-gradient" aria-hidden="true" />
      <p className="pillar-card-title">{pillar.title}</p>
      <div className="pillar-card-hover">
        <p className="pillar-card-hover-title">{pillar.title}</p>
        <p className="pillar-card-desc">{pillar.description}</p>
        <ul className="pillar-card-bullets">
          {pillar.bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function PillarsSection() {
  return (
    <section className="pillars">
      <h2 className="pillars-heading">Our 3 Pillars</h2>
      <div className="pillars-grid">
        {pillars.map(p => <PillarCard key={p.id} pillar={p} />)}
      </div>
    </section>
  );
}
