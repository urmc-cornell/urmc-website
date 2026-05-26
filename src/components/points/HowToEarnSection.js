import bookIcon from '../../images/points-page/book.svg';
import lightningIcon from '../../images/points-page/lightning.svg';
import trophyIcon from '../../images/points-page/trophy.svg';
import '../../styles/points.css';

const TIERS = [
  {
    title: 'Tier 1',
    icon: bookIcon,
    iconAlt: 'book',
    events: [
      { name: 'Academic Event', points: '1 pt' },
      { name: 'Mentor-Mentee Hangout', points: '1 pt' },
      { name: 'Corporate Event', points: '1 pt' },
      { name: 'Professional Dev Event', points: '2 pts' },
      { name: 'Alumni Event', points: '2 pts' },
    ],
  },
  {
    title: 'Tier 2',
    icon: lightningIcon,
    iconAlt: 'lightning',
    events: [
      { name: 'General Body Meeting', points: '3 pts' },
      { name: 'Join Mentorship Program', points: '3 pts' },
      { name: 'Web Development Event', points: '4 pts' },
      { name: 'Design Event', points: '4 pts' },
      { name: 'Register as a TA', points: '4 pts' },
    ],
  },
  {
    title: 'Tier 3',
    icon: trophyIcon,
    iconAlt: 'trophy',
    events: [
      { name: 'General Body Social', points: '5 pts' },
      { name: '10-Year Anniversary', points: '6 pts' },
    ],
  },
];

export default function HowToEarnSection() {
  return (
    <section className="points-howto-section">
      <div className="points-howto-header">
        <h2 className="points-howto-title">How to Earn Points</h2>
        <p className="points-howto-subtitle">
          Points are primarily earned by attending events and completing the
          sign-in form shared at the start of each URMC event.
        </p>
      </div>

      <div className="points-tiers-grid">
        {TIERS.map((tier) => (
          <div key={tier.title} className="points-tier-card">
            <div className="points-tier-title-block">
              <h3 className="points-tier-title">{tier.title}</h3>
              <img
                src={tier.icon}
                alt={tier.iconAlt}
                className="points-tier-icon"
              />
            </div>
            <ul className="points-tier-events">
              {tier.events.map((event) => (
                <li key={event.name} className="points-tier-event">
                  <span className="points-tier-event-name">{event.name}</span>
                  <span className="points-tier-event-points">{event.points}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
