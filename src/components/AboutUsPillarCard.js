import React, { Component } from 'react'
import '../styles/AboutUsPillarCard.css'


const AboutUsPillarCard = (props) => {
    return (
        <div className="card">
            <div className="content">
                <div className="title">{props.title}</div>
                <div className="body-about-us">{props.body}</div>
            </div>
        </div>
    )
};

export default AboutUsPillarCard;
