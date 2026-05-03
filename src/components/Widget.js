import React from 'react'
import '../styles/Widget.css'

const Widget = (props) => {
    return (
        <div className="widget">
            <div className="container">
                <img className="icon" src={props.image}></img>
                <div className="widget-content">
                    <div className="widget-title">{props.title}</div>
                    <div className="widget-body">{props.body}</div>
                </div>
            </div>
        </div>
    )
};

export default Widget;
