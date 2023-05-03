import '../styles/Events.css';
import React, { Component } from 'react'
import EventsPopup from '../components/eventsPopup';


let SHEET_ID = "1Xfl8FV_jihQp8WaH7KvMTCqUwVCAQFHF7K9VV9QwPF8"
let SHEET_TITLE = "URMC Website Events"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let SHEET_RANGE = 'A2:D37'

let FULL_URL = ("https://docs.google.com/spreadsheets/d/" + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedEvent: null,
            events: [],
            popupActive: false
        };
    }

    componentDidMount() {
        fetch(FULL_URL)
            .then(res => res.text())
            .then(rep => {
                let data = JSON.parse(rep.substring(47).slice(0, -2));
                let activeRows = data.table.rows.length;
                let grid = document.getElementById("events")

                let events = []
                for (let i = 0; i < activeRows; i++) {
                    let blurb = data.table.rows[i].c[3].v
                    let rawImageURL = data.table.rows[i].c[2].v
                    let id = rawImageURL.split('=')[1];
                    let flyerURL = "https://drive.google.com/uc?export=view&id=" + id

                    console.log(i)

                    let event = {
                        flyer: flyerURL,
                        blurb: blurb
                    }

                    events.push(event)
                }

                this.setState({
                    events: events,
                })
            })

    }

    handleCardClick = (event) => {
        this.setState({ selectedEvent: event, popupActive: true });
    }

    handleClose = (active) => {
        this.setState({ selectedEvent: null, popupActive: active });
        console.log("I was called")
    }

    render() {
        return (
            <div>
                <h1 align="center">Events</h1>
                <h2 className="this-week">THIS WEEK @ URMC:</h2>
                <EventsPopup trigger={this.state.popupActive} event={this.state.selectedEvent} setTrigger={this.handleClose}></EventsPopup>
                <div align="center">
                    <div className="grid-container" id="events">
                        {this.state.events.map(event =>
                            <div className="grid-item" onClick={() => this.handleCardClick(event)}>
                                <img src={event.flyer}></img>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Events