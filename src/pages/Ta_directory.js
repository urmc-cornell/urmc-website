import React, { Component } from "react";
import EboardCard from "../components/EboardCard.js";
import "../styles/Leadership.css";
import { cards } from "../Supporting/TA-Constants.js";
import EboardPopup from "../components/eboardPopup.js";
import TaPopup from "../components/taPopup.js";

class TADirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCard: null,
      popupActive: false,
    };
  }

  handleCardClick = (card) => {
    this.setState({ selectedCard: card, popupActive: card.popup });
  };

  handleClose = (active) => {
    this.setState({ selectedCard: null, popupActive: active });
  };

  render() {
    const { selectedCard } = this.state;

    return (
      <div>
        <h1 className="leadership">URM TA Directory</h1>
        <h2 className="fall22"> Fall 2024</h2>
        <TaPopup
          trigger={this.state.popupActive}
          card={this.state.selectedCard}
          setTrigger={this.handleClose}
        >
          <h3>My popup!</h3>
        </TaPopup>
        <div className="grid-container-container">
          <div
            className="grid-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            {cards.map((card) => (
              <div
                className="grid-item"
                onClick={() => this.handleCardClick(card)}
              >
                <div
                  className="ta-card"
                  style={{
                    backgroundColor: "#f2d2bd",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    margin: "10px",
                    cursor: "pointer",
                    width: "264px",
                    height: "150px",
                  }}
                >
                  <h3>{card.title}</h3>
                  <p>{card.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default TADirectory;
