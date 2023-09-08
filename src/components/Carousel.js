import React, { useState } from 'react'
import '../styles/Carousel.css'

import kayla from '../headshots/kaylaPrimary.png';
import CarouselItem from './CarouselItem';


const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { image: kayla },
        { image: kayla },

    ]

    return (
        <div className="carousel">
            <div className="inner"
                style={{ transform: `translate(-${activeIndex * 100})` }}>
                {items.map((item) => {
                    return <CarouselItem item={item} />;
                })}
            </div>
            <div className="carousel-bottom-bar">
                <button>
                    arrow left
                </button>
                <div className="indicators"> ... </div>
                <button>
                    arrow right
                </button>
            </div>
            
        </div>
    );
};

export default Carousel;
