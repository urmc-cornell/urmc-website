import _Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/sponsors.css';

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

const Slider = _Slider.default || _Slider;

// Figma exact dimensions (node 135-85)
const sponsors = [
  { src: accenture,  alt: 'Accenture',  w: 154, h: 86    },
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

const sliderSettings = {
  infinite: true,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 5000,
  cssEase: 'linear',
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 900,  settings: { slidesToShow: 4 } },
    { breakpoint: 600,  settings: { slidesToShow: 3 } },
  ],
};

export default function SponsorsCarousel() {
  return (
    <section className="sponsors">
      <h2 className="sponsors-heading">Our Sponsors</h2>
      <div className="sponsors-track">
        <Slider {...sliderSettings}>
          {sponsors.map(({ src, alt, w, h }) => (
            <div key={alt} className="sponsor-slide">
              <img
                src={src}
                alt={alt}
                className={`sponsor-logo${alt === 'Visa' ? ' sponsor-logo--visa' : ''}${alt === 'EY' ? ' sponsor-logo--ey' : ''}`}
                style={{
                  width:  `calc(${w}px * var(--scale, 1))`,
                  height: `calc(${h}px * var(--scale, 1))`,
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
