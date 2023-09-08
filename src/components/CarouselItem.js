import React, { Component } from 'react'

import kayla from '../headshots/kaylaPrimary.png';


const CarouselItem = ({ item }) => {
    return (
        <div className="carousel-item">
            <div>
                <img className="carousel-img" src={item.image}></img>
            </div>
        </div>
    )
};

export default CarouselItem;
