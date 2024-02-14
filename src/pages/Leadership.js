import React, { Component } from 'react'
import EboardCard from '../components/EboardCard';
import '../styles/Leadership.css';
import EboardPopup from '../components/eboardPopup';
import { cards } from '../Supporting/Leadership-Constants'



let sheetID = "1MSvTcAeph8ehYwtBIBBbcLLkVg3JhWwtTCz1ODSEl1w"
let sheetTitle = "eboard"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let sheetRange = 'A2:O37'
let fullURL = ("https://docs.google.com/spreadsheets/d/" + sheetID + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange);

class Leadership extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCard: null,
            popupActive: false,
            eboard_list: [],
        };
    }

    componentDidMount() {
        fetch(fullURL)
            .then(res => res.text())
            .then(rep => {
                // figure out why 47, 0, -2 here 
                    // its from some tutorial but it basicially gets you each row 
                    // and it's information which we use below
                
                let data = JSON.parse(rep.substring(47).slice(0, -2));
                let activeRows = data.table.rows.length;

                let eboard = []

                for (let i = 0; i < activeRows; i++) {
                    let id = data.table.rows[i].c[0].v
                    let title = data.table.rows[i].c[4].v
                    let headshot_one = data.table.rows[i].c[5].v
                    let name = data.table.rows[i].c[2].v
                    let headshot_two = data.table.rows[i].c[6].v
                    let majors = data.table.rows[i].c[9].v
                    let instagram =  data.table.rows[i].c[10].v
                    let linkedin = data.table.rows[i].c[11].v
                    let askAbout = data.table.rows[i].c[8].v
                    let bio = data.table.rows[i].c[7].v
                    var popup = true


                    let headshot_one_id = headshot_one.split('/')[5];
                    let headshot_one_url = "https://drive.google.com/uc?id=" + headshot_one_id
                    // https://drive.google.com/uc?id=

                    let headshot_two_id = headshot_two.split('/')[5];
                    let headshot_two_url = "https://drive.google.com/uc?id=" + headshot_two_id

                    if (bio != 'test') {
                        popup = true
                    } else {
                        popup = false
                    }

                    let eboard_card = {
                        id: id,
                        title: title,
                        image: headshot_one_url,
                        name: name,
                        secondaryImage: headshot_two_url,
                        majors: majors,
                        insta: instagram,
                        linkedIn: linkedin,
                        // makes comma seperated list of interests
                        askAbout: askAbout.split(","),
                        bio: bio,
                        // popup, popup
                        popup: popup,


                    }
                    eboard.push(eboard_card)
                }

                this.setState({
                    eboard_list: eboard,
                })
            })

    }
    handleCardClick = (card) => {
        this.setState({ selectedCard: card, popupActive: card.popup });
    }

    handleClose = (active) => {
        this.setState({ selectedCard: null, popupActive: active });
    }


    render() {
        const {selectedCard, eboard_list } = this.state;

        return <div>
            <h1 className="leadership">Executive Board</h1>
            <h2 className="fall22"> Spring 2024 - Coming Soon</h2>
            <EboardPopup trigger={this.state.popupActive} card={this.state.selectedCard} setTrigger={this.handleClose}>
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
        </div>
    }
}

export default Leadership;