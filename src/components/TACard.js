import React, { Component } from 'react'
import '../styles/tacard.css'

function TACard(props) {
    return (
        <eboardcard>
            <div className="card-container">
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

export default TACard;