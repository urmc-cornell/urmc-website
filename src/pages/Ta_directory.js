import React, { Component } from 'react'
import EboardCard from '../components/EboardCard';
import '../styles/Leadership.css';
import { cards } from '../Supporting/TA-Constants'
import EboardPopup from '../components/eboardPopup';
import TaPopup from '../components/taPopup';

class TADirectory extends Component {
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
    }

    render() {
        const { selectedCard } = this.state;

        return <div>
            <h1 className="leadership">URM TA Directory</h1>
            <h2 className="fall22"> Fall 2024</h2>
            <TaPopup trigger={this.state.popupActive} card={this.state.selectedCard} setTrigger={this.handleClose}>
                <h3>My popup!</h3>
            </TaPopup>
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
        </div>
    }
}

export default TADirectory;