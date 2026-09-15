import '../../styles/sponsors-carousel.css';

import accenture from '../../images/home/sponsor-accenture.png';
import bloomberg from '../../images/home/sponsor-bloomberg.png';
import capitalOne from '../../images/home/sponsor-capitalone.png';
import datadog from '../../images/home/sponsor-datadog.png';
import ey from '../../images/home/sponsor-ey.png';
import figma from '../../images/home/sponsor-figma.png';
import hrt from '../../images/home/sponsor-hrt.png';
import janeStreet from '../../images/home/sponsor-janestreet.png';
import linkedin from '../../images/home/sponsor-linkedin.png';
import roblox from '../../images/home/sponsor-roblox.png';
import visa from '../../images/home/sponsor-visa.png';

// Reference logo proportions (Figma node 135-85).
const sponsors = [
  { src: accenture,  alt: 'Accenture',  w: 260, h: 145   },
  { src: bloomberg,  alt: 'Bloomberg',   w: 303, h: 56    },
  { src: capitalOne, alt: 'Capital One', w: 268, h: 151   },
  { src: datadog,    alt: 'Datadog',     w: 176, h: 178   },
  { src: ey,         alt: 'EY',          w: 164, h: 168   },
  { src: figma,      alt: 'Figma',       w: 301, h: 150   },
  { src: hrt,        alt: 'HRT',         w: 258, h: 150   },
  { src: janeStreet, alt: 'Jane Street', w: 302, h: 119   },
  { src: linkedin,   alt: 'LinkedIn',    w: 302, h: 74    },
  { src: roblox,     alt: 'Roblox',      w: 301, h: 80    },
  { src: visa,       alt: 'Visa',        w: 300, h: 300   },
];

export default function SponsorsCarousel() {
  return (
    <section className="sponsors">
      <h2 className="sponsors-heading">Our Sponsors</h2>
      <div className="sponsors-track">
        <div className="sponsors-marquee">
          {[0, 1].map(copy => (
          <div className="sponsors-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {sponsors.map(({ src, alt, w, h }) => (
            <div key={alt} className="sponsor-slide" >
              <a href="/sponsors" className="sponsor-link" tabIndex={copy === 1 ? -1 : undefined} draggable={false} aria-label={`${alt} — View all sponsors`}>
                <img
                  src={src}
                  draggable={false}
                  alt={alt}
                  className={`sponsor-logo${alt === 'Visa' ? ' sponsor-logo--visa' : ''}${alt === 'EY' ? ' sponsor-logo--ey' : ''}${alt === 'Accenture' ? ' sponsor-logo--accenture' : ''}`}
                  style={{
                    width:  `${w / 20}rem`,
                    height: `${h / 20}rem`,
                  }}
                />
              </a>
            </div>
          ))}
        </div>
          ))}
        </div>
      </div>
    </section>
  );
}
