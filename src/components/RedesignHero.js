import '../styles/redesign-hero.css';

export default function RedesignHero({ title, description, image, imageAlt, className = '', children }) {
  return (
    <section className={`redesign-hero ${className}`}>
      <div className="redesign-hero-copy">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="redesign-hero-actions">{children}</div>
      </div>
      <div className="redesign-hero-image"><img src={image} alt={imageAlt} /></div>
    </section>
  );
}
