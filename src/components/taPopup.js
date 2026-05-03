import React from 'react';
import '../styles/eboardPopup.css'
import mailGold from '../images/assets/mailGold.png';
import instaGold from '../images/assets/instagramGold.png';
import linkedGold from '../images/assets/linkedinGold.png';
import x from '../images/assets/x.png';

function TaPopup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="img-profile">
                    <div className="secondary">
                        <img src={props.card.secondaryImage}></img>
                    </div>
                    <div className="profile-stack">
                        <div className="name">{props.card.name}</div>
                        {/* <div className="position">{props.card.title}</div> */}
                        <div className="year">{props.card.majors}</div>
                        <div className="ask-about">TA FOR: </div>
                        <div className="abouts">
                            {props.card.askAbout.map((item, index) => (
                                <div key={index} className="about-item">
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="contact">CONTACT ME:</div>
                        <div className="contacts">
                            <a href="https://www.instagram.com/urmc_cornell/" target="_blank">
                                <img src={mailGold} className="socials" href="/"></img>
                            </a>
                            <a href={props.card.insta} target="_blank">
                                <img src={instaGold} className="socials" href="/"></img>
                            </a>
                            <a href={props.card.linkedIn} target="_blank">
                                <img src={linkedGold} className="socials" href="/"></img>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="bio">{props.card.bio}</div>
                <img src={x} className="close-btn" onClick={() => props.setTrigger(false)}></img>
            </div>
        </div>
    ) : "";
}

export default TaPopup