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
    imgStyle: { width: '149.9%', height: '100.15%', top: '-0.24%', left: '-16.31%' },
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
    imgStyle: { width: '141.04%', height: '201.31%', top: '-24.59%', left: '-17.13%' },
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
    imgStyle: { width: '111.15%', height: '158.44%', top: '-51.23%', left: '-3.08%', objectFit: 'cover' },
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`pillar-card pillar-card--${pillar.id}${hovered ? ' pillar-card--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo — no overlay by default */}
      <div className="pillar-card-photo">
        <img src={pillar.image} alt={pillar.title} style={pillar.imgStyle} />
      </div>

      {/* Dark overlay — only visible on hover */}
      <div className="pillar-card-overlay" aria-hidden="true" />

      {/* Description + bullets — only visible on hover */}
      <div className="pillar-card-content">
        <p className="pillar-card-desc">{pillar.description}</p>
        <ul className="pillar-card-bullets">
          {pillar.bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      </div>

      {/* Footer: title */}
      <div className="pillar-card-footer">
        <p className="pillar-card-title">{pillar.title}</p>
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
