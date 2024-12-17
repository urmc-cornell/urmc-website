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

    groupCardsByCourse = () => {
        const grouped = {};
        cards.forEach(card => {
            const courseNum = card.title.split(' ')[1]; // Assumes format "CS XXXX"
            if (!grouped[courseNum]) {
                grouped[courseNum] = [];
            }
            grouped[courseNum].push(card);
        });
        return grouped;
    }

    handleCardClick = (card) => {
        this.setState({ selectedCard: card, popupActive: card.popup });
    }

    handleClose = (active) => {
        this.setState({ selectedCard: null, popupActive: active });
    }

    render() {
        const groupedCards = this.groupCardsByCourse();

        return <div>
            <h1 className="leadership">URM TA Directory</h1>
            <h2 className="fall22"> Fall 2024</h2>
           
            <div className="course-sections">
                {Object.entries(groupedCards).map(([courseNum, courseCards]) => (
                    <div key={courseNum} className="course-section">
                        <h2 className="course-header">CS {courseNum}</h2>
                        <div className="grid-container" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px',
                            justifyContent: 'start',
                            padding: '20px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            {courseCards.map(card => (
                                <div 
                                    key={card.name}
                                    className="grid-item"
                                    onClick={() => this.handleCardClick(card)}
                                >
                                    <div className="ta-card" style={{
                                        backgroundColor: '#f2d2bd',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        margin: '10px',
                                        cursor: 'pointer',
                                        width: '264px',
                                        height: '150px'
                                    }}>
                                        <h3>{card.title}</h3>
                                        <p>{card.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    }
}

export default TADirectory;