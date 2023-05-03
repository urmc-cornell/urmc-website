import React from 'react';
import '../styles/eventsPopup.css'
import mailGold from '../images/assets/mailGold.png';
import instaGold from '../images/assets/instagramGold.png';
import linkedGold from '../images/assets/linkedinGold.png';
import x from '../images/assets/x.png';


function eventsPopup(props) {
    return (props.trigger) ? (
        <div className="popup-event">
            <div className="popup-inner-event">
                <img src={x} className="close-btn" onClick={() => props.setTrigger(false)}></img>
                <img src={props.event.flyer}></img>
                <div className="blurb-background">
                    <div className="blurb">{props.event.blurb}</div>
                </div>
            </div>

        </div>
    ) : "";
}

export default eventsPopup