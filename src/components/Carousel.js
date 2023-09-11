import React, { useState } from 'react'
import '../styles/Carousel.css'

import leftArrow from '../images/assets/arrow_left.png';
import rightArrow from '../images/assets/arrow_right.png';
import filledIndicator from '../images/assets/indicator_filled.png'
import emptyIndicator from '../images/assets/indicator_empty.png'

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
                style={{ transform: `translate(-${activeIndex * 100}%)` }}>
                {items.map((item) => {
                    return <CarouselItem item={item}></CarouselItem>
                })}
            </div>
            <div className="carousel-bottom-bar">
                <button className="button-arrow" onClick={() => { updateIndex(activeIndex - 1) }}>
                    <img src={leftArrow} />
                </button>
                <div className="indicators">
                    {items.map((item, index) => {
                        return (
                            <button
                                onClick={() => {
                                    updateIndex(index);
                                }}
                                className="button-arrow"
                            >
                                <img src={index === activeIndex ? filledIndicator : emptyIndicator} />
                            </button>
                        )
                    })}
                </div>

                <button className="button-arrow" onClick={() => { updateIndex(activeIndex + 1) }}>
                    <img src={rightArrow} />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
