import { useState } from 'react';
import teamPhoto from '../../images/eboardPhoto.jpg';
import '../../styles/Leadership.css';

const CATEGORIES = [
  { label: 'Full Team',          key: 'all' },
  { label: 'Presidents',         key: 'presidents' },
  { label: 'Events',             key: 'events' },
  { label: 'Community Building', key: 'community-building' },
  { label: 'External',           key: 'external' },
  { label: 'Internal',           key: 'internal' },
  { label: 'Advisors',           key: 'advisors' },
];

export default function TeamSection({ onCategoryChange }) {
  const [active, setActive] = useState('all');

  const handleClick = (key, e) => {
    setActive(key);
    onCategoryChange(key);
    e.currentTarget.blur();
  };

  return (
    <section className="wwa-team-section">
      <div className="wwa-team-content">
        <div className="wwa-team-intro">
          <div className="wwa-team-intro-texts">
            <h2 className="wwa-team-title">
              The <span className="wwa-team-title-highlight">team</span> behind the{' '}
              <br className="wwa-team-title-break" />impact
            </h2>
            <p className="wwa-team-subtitle">
              Meet the leaders working to make computing a space where every student can thrive
            </p>
          </div>
          <div className="wwa-team-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={[
                  'wwa-team-category-btn',
                  active === cat.key ? 'wwa-team-category-btn--active' : '',
                ].join(' ')}
                onClick={(e) => handleClick(cat.key, e)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="wwa-team-photo-wrap">
          <img src={teamPhoto} alt="URMC team" className="wwa-team-photo" />
        </div>
      </div>
    </section>
  );
}
