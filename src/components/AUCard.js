import React, { Component } from 'react'

class AUCard extends Component {
    // export default function AUCard() {

    render(props) {
        return (
            <div className="card">
                <h1>{this.props.title}</h1>
                <div className="images">
                    <img src={blue_ellipse} className="blue_ellipse"></img>
                    <img src={yellow_ellipse} className="yellow_ellipse"></img>
                </div>
            </div>
        )
    }
}

export default AUCard