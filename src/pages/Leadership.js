import React, { Component } from 'react'
import EboardCard from '../components/EboardCard';
import '../styles/Leadership.css';
import {cards} from '../Supporting/Constants.js'
class Leadership extends Component {

    render() {
        return <leadership>
            <h1 className="leadership">Executive Board</h1>
            <h2 className="fall22"> Spring 2023</h2>
            <div className="grid-container">
                {cards.map(card => (
                    <div className="grid-item">
                        <EboardCard
                            key={card.id}
                            imageURL={card.image}
                            title={card.title}
                            name={card.name}
                        />
                    </div>

                ))}
            </div>
        </leadership>
    }
}


export default Leadership;