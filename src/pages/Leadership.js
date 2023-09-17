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


    componentDidMount() {
        fetch("https://script.googleusercontent.com/macros/echo?user_content_key=A957UGVKpaj3sDPBnmSFp4J-e8kVYycT_qVI9nzg9Jl4GpMr9Zue9vkWNRMS3VDrKDe39EiKGVmvpuHwsAobatNo28AVKCy4m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMGN2GrXRN10VNZKmRWmvMUvmnimkcUT1nXOlb_Wu_f5FYze0Vr-3oU0m1PRW2sM3sU7zjgJ81MccfaD4rSjTHfwtV92wPHIJw&lib=MRUYj6yJa0sVkk_VgpuBrFp7oKR2YfmXG")
        .then(response => response.json())
        // .then(data => 
        // );


    }

    handleCardClick = (card) => {
        this.setState({ selectedCard: card, popupActive: card.popup });
    }

    handleClose = (active) => {
        this.setState({ selectedCard: null, popupActive: active });
    }

    render() {
        const { selectedCard } = this.state;

        return <div className="leadership-page">
            <h1 className="leadership">Executive Board</h1>
            <h2 className="fall22"> Spring 2023</h2>
            <EboardPopup trigger={this.state.popupActive} card={this.state.selectedCard} setTrigger={this.handleClose}>
            </EboardPopup>
            <div className="grid-container-container">
                <div className="grid-container">
                    {cards.map(card => (
                        <div className="grid-item"
                            onClick={() => this.handleCardClick(card)}>
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

export default Leadership;