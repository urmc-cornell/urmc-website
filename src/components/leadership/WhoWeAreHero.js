import '../../styles/Leadership.css';

export default function WhoWeAreHero({ photo }) {
  return (
    <section className="wwa-hero">
      <div className="wwa-hero-text">
        <h1 className="wwa-hero-title">Who We Are</h1>
        <p className="wwa-hero-subtitle">
          URMC is a community of{' '}
          <span className="wwa-highlight">Black</span>,{' '}
          <span className="wwa-highlight">Latinx</span>, and{' '}
          <span className="wwa-highlight">Indigenous</span>{' '}
          students in computing at Cornell — led by the people below.
        </p>
      </div>
      <img
        src={photo}
        alt="URMC leadership group"
        className="wwa-hero-image"
      />
    </section>
  );
}
