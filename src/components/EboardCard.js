import React, { Component } from 'react'
import '../styles/eboardcard.css'

function EboardCard(props) {
    return (
        <eboardcard>
            <div className="card-container">
                <div className="image-container">
                    <img src={props.imageURL} alt=''></img>
                </div>
                <div className="card-title">
                    {props.title}
                </div>
                <div className="card-name">
                    {props.name}
                </div>
            </div>

        </eboardcard>
    )
}

export default EboardCard;