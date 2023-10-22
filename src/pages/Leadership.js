import React, { Component } from 'react'
import EboardCard from '../components/EboardCard';
import '../styles/Leadership.css';
import { cards } from '../Supporting/Constants.js'
import EboardPopup from '../components/eboardPopup';


let sheetID = "1MSvTcAeph8ehYwtBIBBbcLLkVg3JhWwtTCz1ODSEl1w"
let sheetTitle = "eboard"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let sheetRange = 'A2:I37'
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
                
                let data = JSON.parse(rep.substring(47).slice(0, -2));
                let activeRows = data.table.rows.length;
                // console.log(activeRows);
                
                // console.log("hello")

                let eboard = []

                for (let i = 0; i < activeRows; i++) {
                    // console.log("I wok")

                    // console.log("whasdfdssdftt")

                    let id = data.table.rows[i].c[0].v
                    let name = data.table.rows[i].c[2].v
                    let graduation_year = data.table.rows[i].c[3].v
                    let position = data.table.rows[i].c[4].v
                    let headshot_one = data.table.rows[i].c[5].v
                    let headshot_two = data.table.rows[i].c[6].v
                    let bio = data.table.rows[i].c[7].v
                    let interests = data.table.rows[i].c[8].v



                    let headshot_one_id = headshot_one.split('=')[1];
                    let headshot_one_url = "https://drive.google.com/uc?export=view&id=" + headshot_one_id

                    let headshot_two_id = headshot_two.split('=')[1];
                    let headshot_two_url = "https://drive.google.com/uc?export=view&id=" + headshot_two_id

                    let eboard_card = {
                        name: name,
                        headshot_one: headshot_one_url,
                        position: position,
                        year: graduation_year,
                        abouts: interests,
                        // contacts: contacts,
                        bio: bio,
                    }
                    eboard.push(eboard_card)
                }

                // console.log("eboard stuff");
                // console.log("whattt");

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
        const { selectedCard, eboard_list } = this.state;

        return <div>
            <h1 className="leadership">Executive Board</h1>
            <h2 className="fall22"> Fall 2023</h2>
            <EboardPopup trigger={this.state.popupActive} card={this.state.selectedCard} setTrigger={this.handleClose}>
            </EboardPopup>
            <div className="grid-container-container">
                <div className="grid-container">
                    {eboard_list.map(card => (
                        <div className="grid-item"
                            onClick={() => this.handleCardClick(card)}>
                            <EboardCard
                                key={card.id}
                                imageURL={card.headshot_one}
                                title={card.position}
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