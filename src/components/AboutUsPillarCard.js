import React, { Component } from 'react'
import '../styles/AboutUsPillarCard.css'


const AboutUsPillarCard = (props) => {
    return (
        <div className="card" style={{backgroundColor: props.color}}>
            <div className="content">
                <div className="title" style={{color: props.textColor}}>{props.title}</div>
                <div className="body-about-us">{props.body}</div>
            </div>
        </div>
    )
};

export default AboutUsPillarCard;
