import React, { Component } from 'react'
import EboardCard from '../components/EboardCard';
import '../styles/Leadership.css';
import { cards } from '../Supporting/Constants.js'
import EboardPopup from '../components/eboardPopup';

class Leadership extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCard: null,
            popupActive: false
        };
    }

    handleCardClick = (card) => {
        this.setState({ selectedCard: card, popupActive: card.popup });
    }

    handleClose = (active) => {
        this.setState({ selectedCard: null, popupActive: active });
        console.log("I was called")
    }

    render() {
        const { selectedCard } = this.state;

        return <leadership>
            <h1 className="leadership">Executive Board</h1>
            <h2 className="fall22"> Spring 2023</h2>
            <EboardPopup trigger={this.state.popupActive} card={this.state.selectedCard} setTrigger={this.handleClose}>
                <h3>My popup!</h3>
            </EboardPopup>
            <div className="grid-container-container">
                <div className="grid-container">
                    {cards.map(card => (
                        <div className="grid-item"
                            onClick={() => this.handleCardClick(card)}
                        >
                            <EboardCard
                                key={card.id}
                                imageURL={card.image}
                                title={card.title}
                                name={card.name}
                                onClick={() => this.handleCardClick(card)}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </leadership>
    }
}

export default Leadership;