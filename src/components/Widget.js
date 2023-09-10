import React, { Component } from 'react'
import '../styles/Widget.css'

const Widget = (props) => {
    return (
        <div className="widget">
            <div className="container">
                <img className="icon" src={props.image}></img>
                <div className="text">
                    <div className="widget-title">{props.title}hi guys</div>
                    <div className="widget-body">{props.body}test widgey</div>
                </div>
            </div>
        </div>
    )
};

export default Widget;
