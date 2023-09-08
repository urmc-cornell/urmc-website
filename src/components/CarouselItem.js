import React, { Component } from 'react'

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
