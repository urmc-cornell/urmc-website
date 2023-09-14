import React, { useState } from 'react'
import '../styles/Carousel.css'

import leftArrow from '../images/assets/arrow_left.png';
import rightArrow from '../images/assets/arrow_right.png';
import filledIndicator from '../images/assets/indicator_filled.png'
import emptyIndicator from '../images/assets/indicator_empty.png'

const Carousel = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= props.pics.length) {
            newIndex = props.pics.length - 1;
        }
        setActiveIndex(newIndex);
    };

    return (
        <div className="carousel">
            <div className="frame">
                <div className="inner"
                    style={{ transform: `translate(-${activeIndex * 100}%)` }}>
                    {props.pics.map((item) => {
                        return <img className="carousel-img" src={item}></img>
                    })}
                </div>
            </div>

            <div className="carousel-bottom-bar" style={{ backgroundColor: props.color }}>
                <button className="button-arrow" onClick={() => { updateIndex(activeIndex - 1) }}>
                    <img src={leftArrow} />
                </button>
                <div className="indicators">
                    {props.pics.map((item, index) => {
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
