import _Slider from 'react-slick';
const Slider = _Slider.default || _Slider;
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/sponsors.css';

import accenture from '../../images/homes/sponsor-accenture.png';
import bloomberg from '../../images/homes/sponsor-bloomberg.png';
import capitalOne from '../../images/homes/sponsor-capitalone.png';
import datadog from '../../images/homes/sponsor-datadog.png';
import ey from '../../images/homes/sponsor-ey.png';
import figma from '../../images/homes/sponsor-figma.png';
import hrt from '../../images/homes/sponsor-hrt.png';
import janeStreet from '../../images/homes/sponsor-janestreet.png';
import linkedin from '../../images/homes/sponsor-linkedin.png';
import roblox from '../../images/homes/sponsor-roblox.png';
import visa from '../../images/homes/sponsor-visa.png';

const sponsors = [
  { src: accenture, alt: 'Accenture' },
  { src: bloomberg, alt: 'Bloomberg' },
  { src: capitalOne, alt: 'Capital One' },
  { src: datadog, alt: 'Datadog' },
  { src: ey, alt: 'EY' },
  { src: figma, alt: 'Figma' },
  { src: hrt, alt: 'HRT' },
  { src: janeStreet, alt: 'Jane Street' },
  { src: linkedin, alt: 'LinkedIn' },
  { src: roblox, alt: 'Roblox' },
  { src: visa, alt: 'Visa' },
];

const sliderSettings = {
  infinite: true,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 5000,
  cssEase: 'linear',
  slidesToShow: 6,
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 4 } },
    { breakpoint: 768, settings: { slidesToShow: 3 } },
    { breakpoint: 480, settings: { slidesToShow: 2 } },
  ],
};

export default function SponsorsCarousel() {
  return (
    <section className="sponsors">
      <h2 className="sponsors-heading">Our Sponsors</h2>
      <div className="sponsors-track">
        <Slider {...sliderSettings}>
          {sponsors.map(({ src, alt }) => (
            <div key={alt}>
              <img src={src} alt={alt} className="sponsor-logo" />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
