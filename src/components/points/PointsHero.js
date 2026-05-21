import '../../styles/points.css';

export default function PointsHero() {
  return (
    <section className="points-hero">
      <div className="points-hero-text">
        <h1 className="points-hero-title">Points</h1>
        <p className="points-hero-subtitle">
          Our points system rewards active engagement in the URMC community through
          event attendance and community support.
        </p>
        <a href="/events" className="points-hero-btn">
          View Upcoming Events
        </a>
      </div>
    </section>
  );
}
