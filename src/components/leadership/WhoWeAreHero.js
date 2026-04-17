import '../../styles/Leadership.css';
import linkIcon from '../../images/link.svg';

export default function WhoWeAreHero({ photo }) {
  return (
    <section className="wwa-hero">
      <div className="wwa-hero-text">
        <h1 className="wwa-hero-title">Who We Are</h1>
        <p className="wwa-hero-subtitle">
          Founded in 2016, URMC began with a simple mission: to create a space
          where all computing students can belong and thrive. Today, we've grown
          into a diverse, cross-disciplinary community, building partnerships,
          attending national conferences, and becoming a proud ColorStack chapter.
          Every step has helped shape URMC into the community it is today.
        </p>
        <div className="wwa-hero-ctas">
          <a
            href="https://www.colorstack.org/"
            target="_blank"
            rel="noreferrer"
            className="wwa-hero-btn-primary"
          >
            10-Year Anniversary Recap
          <img src={linkIcon} alt="" className="wwa-hero-btn-icon" />
          </a>
          <a href="/getting-involved" className="wwa-hero-btn-secondary">
            Get Involved
          </a>
        </div>
      </div>
      <img
        src={photo}
        alt="URMC members"
        className="wwa-hero-image"
      />
    </section>
  );
}
