import merchImage from '../../images/points-page/merch.png';
import afrotechImage from '../../images/points-page/afrotech-reward.png';
import '../../styles/points.css';

const REWARDS = [
  {
    name: 'URMC Merch',
    detail: '45 pts',
    image: merchImage,
    alt: 'URMC merch crewneck',
  },
  {
    name: 'Conference Scholarship',
    detail: 'Top Earners',
    image: afrotechImage,
    alt: 'URMC members at AfroTech conference',
  },
];

export default function RewardsSection() {
  return (
    <section className="points-rewards-section">
      <h2 className="points-rewards-title">Rewards</h2>
      <div className="points-rewards-grid">
        {REWARDS.map((reward) => (
          <div key={reward.name} className="points-reward-card">
            <div className="points-reward-header">
              <h3 className="points-reward-name">{reward.name}</h3>
              <p className="points-reward-detail">{reward.detail}</p>
            </div>
            <div className="points-reward-photo-wrap">
              <img
                src={reward.image}
                alt={reward.alt}
                className="points-reward-photo"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
