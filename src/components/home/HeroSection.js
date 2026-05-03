import { useState, useEffect } from 'react';
import carousel1 from '../../images/home/gbody.jpg';
import carousel2 from '../../images/home/urmc-carousel2.jpg';
import carousel3 from '../../images/home/hero-photo.jpg';
import carousel4 from '../../images/home/event-center-top.jpg';
import carousel5 from '../../images/home/event-center-bottom.jpg';
import '../../styles/hero.css';

const SLIDES = [carousel1, carousel2, carousel3, carousel4, carousel5];
const INTERVAL = 4000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

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

      <div className="hero-image-wrap">
        {SLIDES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="URMC students"
            className={`hero-carousel-img${i === current ? ' hero-carousel-img--active' : ''}`}
          />
        ))}
        <div className="hero-carousel-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-carousel-dot${i === current ? ' hero-carousel-dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
