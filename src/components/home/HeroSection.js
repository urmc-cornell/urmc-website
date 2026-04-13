import heroPhoto from '../../images/homes/hero-photo.jpg';
import '../../styles/hero.css';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Underrepresented Minorities in Computing</h1>
        <p className="hero-subtitle">
          Building a supportive community for{' '}
          <span className="highlight">Black</span>,{' '}
          <span className="highlight">Latinx</span>, and{' '}
          <span className="highlight">Indigenous</span>{' '}
          students <span className="bold">since 2016</span>
        </p>
        <div className="hero-ctas">
          <a href="/getting-involved" className="hero-btn-primary">Get Involved</a>
          <a href="/leadership" className="hero-btn-secondary">Who We Are</a>
        </div>
      </div>
      <img
        src={heroPhoto}
        alt="URMC students"
        className="hero-image"
      />
    </section>
  );
}
