import React, { Component } from 'react'

const CarouselItem = ({ item }) => {
    return (
        <div className="carousel-item">
            <img className="carousel-img" src={item.image}></img>
        </div>
    )
};

export default CarouselItem;
