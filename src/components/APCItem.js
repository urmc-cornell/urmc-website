import React from 'react';
import Slider from 'react-slick';


const Carousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
  
    return (
      <Slider {...settings}>
        <div>
          <h3>Slide 1</h3>
          <img src="../images/academic.png" alt="slide-1" />
        </div>
        <div>
          <h3>Slide 2</h3>
          <img src="../images/academic.png" alt="slide-2" />
        </div>
        <div>
          <h3>Slide 3</h3>
          <img src="../images/academic.png" alt="slide-3" />
        </div>
        <div>
          <h3>Slide 4</h3>
          <img src="../images/academic.png" alt="slide-4" />
        </div>
        <div>

        </div>
      </Slider>
    );
  };
  
  export default Carousel;