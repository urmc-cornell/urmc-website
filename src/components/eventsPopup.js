import React from 'react';
import '../styles/eventsPopup.css'
import insta from '../images/assets/instagram_color.png'
import calendar from '../images/assets/calendar_color.png'

import x from '../images/assets/x.png';


function eventsPopup(props) {
    return (props.trigger) ? (
        <div className="popup-event">
            <div className="popup-inner-event">
                <img src={x} className="close-btn" onClick={() => props.setTrigger(false)}></img>
                <div className="flyer">
                    <div className="flyer-container">
                        <div className="sidebar">
                            <a target="_blank" href={props.event.instaLink.length ? props.event.instaLink : "https://www.instagram.com/urmc_cornell/"}>
                                <img src={insta} ></img>
                            </a>
                            <a target="_blank"  href="https://calendar.google.com/calendar/embed?src=archive.urmc%40gmail.com&ctz=America%2FNew_York">
                                <img src={calendar}></img>
                            </a>
                        </div>
                        <img src={props.event.flyer} className="flyer-image"></img>
                    </div>
                </div>
                <div className="blurb-background">
                    <div className="blurb">{props.event.blurb}</div>
                </div>
            </div>
        </div>
    ) : "";
}

export default eventsPopup