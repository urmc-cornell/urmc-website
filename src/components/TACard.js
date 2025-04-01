import React, { Component } from 'react'
import '../styles/tacard.css'

function TACard(props) {
    return (
            <div className="card-container">
                <div className="card-title">
                    {props.title}
                </div>
                <div className="card-name">
                    {props.name}
                </div>
            </div>
    )
}

export default TACard;