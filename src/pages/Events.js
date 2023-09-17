import '../styles/Events.css';
import React, { Component } from 'react'
import EventsPopup from '../components/eventsPopup';


let sheetID = "1Xfl8FV_jihQp8WaH7KvMTCqUwVCAQFHF7K9VV9QwPF8"
let sheetTitle = "URMC Website Events"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let sheetRange = 'A2:F37'
let fullURL = ("https://docs.google.com/spreadsheets/d/" + sheetID + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange);

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedEvent: null,
            // events: [],
            pastEvents: [],
            comingUpEvents: [],
            popupActive: false
        };
    }

    componentDidMount() {
        fetch(fullURL)
            .then(res => res.text())
            .then(rep => {
                // figure out why 47, 0, -2 here
                
                let data = JSON.parse(rep.substring(47).slice(0, -2));
                let activeRows = data.table.rows.length;

                let comingUpEvents = []
                let pastEvents = []

                let events = []
                for (let i = 0; i < activeRows; i++) {
                    // 
                    let rawImageURL = data.table.rows[i].c[2].v
                    let blurb = data.table.rows[i].c[3].v

                    let instaLink = ""

                    try {
                        instaLink = data.table.rows[i].c[4].v
                    }
                    catch (err) {
                    }

                    // let instaLink = (data.table.rows[i].c[4].v == null) ? "link" : data.table.rows[i].c[4].v
                    let eventDate = new Date(Date.parse(data.table.rows[i].c[5].f))
                    let id = rawImageURL.split('=')[1];
                    let flyerURL = "https://drive.google.com/uc?export=view&id=" + id

                    let event = {
                        flyer: flyerURL,
                        blurb: blurb,
                        date: eventDate,
                        instaLink: instaLink
                    }

                    if(event.date >= new Date()) {
                        comingUpEvents.push(event)
                        
                    } else {
                        pastEvents.push(event)
                    }
                    // events.push(event)
                }

                this.setState({
                    // events: events
                    pastEvents: pastEvents,
                    comingUpEvents: comingUpEvents
                })
            })

    }

    handleCardClick = (event) => {
        this.setState({ selectedEvent: event, popupActive: true });
    }

    handleClose = (active) => {
        this.setState({ selectedEvent: null, popupActive: active });
    }

    render() {
        return (
            <div>
                <h1 align="center">Events</h1>
                <EventsPopup trigger={this.state.popupActive} event={this.state.selectedEvent} setTrigger={this.handleClose}></EventsPopup>
                <div align="center">
                    {this.state.comingUpEvents.length ? <h2 align="left" className="this-week">COMING UP @ URMC:</h2> : null}
                    <div className="grid-container">
                        {this.state.comingUpEvents.sort((a, b) => a.date - b.date).map(event =>
                            <div className="grid-item" onClick={() => this.handleCardClick(event)}>
                                <img src={event.flyer}>
                                </img>
                            </div>
                        )}
                    </div>
                    <h2 align="left" className="this-week">PAST EVENTS:</h2>
                    <div className="grid-container">
                        {this.state.pastEvents.sort((a, b) => b.date - a.date).map(event =>
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