import React, { useState } from 'react'
import '../styles/Carousel.css'

import leftArrow from '../images/assets/arrow_left.png';
import rightArrow from '../images/assets/arrow_right.png';


import kayla from '../headshots/kaylaPrimary.png';
import carousel from '../images/carousel/carousel1.png';
import CarouselItem from './CarouselItem';





const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { image: carousel },
        { image: carousel },
        { image: carousel },
        { image: carousel }, 
        { image: carousel }, 
        { image: carousel },
        { image: carousel },
        { image: carousel },
        { image: carousel },
        { image: carousel }, 
        { image: carousel }, 
        { image: carousel },

    ]

    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= items.length) {
            newIndex = items.length - 1;
        }
        setActiveIndex(newIndex);
    };

    return (
        <div className="carousel">
            <div className="inner"
                style={{ transform: `translate(-${activeIndex * 103}%)` }}>
                {items.map((item) => {
                    return <CarouselItem item={item} />;
                })}
            </div>
            <div className="carousel-bottom-bar">
                <button className="button-arrow" onClick={() => { updateIndex(activeIndex - 1) }}>
                    <img src={leftArrow}></img>
                </button>
                <div className="indicators"> ... </div>
                <button className="button-arrow" onClick={() => { updateIndex(activeIndex + 1) }}>
                    <img src={rightArrow}></img>
                </button>
            </div>
        </div>
    );
};

export default Carousel;
