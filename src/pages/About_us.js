import React, { Component } from 'react'
import academic from '../images/academic.png';
import community from '../images/community.png';
import profdev from '../images/profdev.png';

class About_us extends Component {

    render() {
        return <about_us>
            <div className="about-us">
                <h1>About Us</h1>
            </div>
            <div className="about-us">
                <h6 className="purpose"> The purpose of Underrepresented Minorities in Computing is to promote diversity
                    within the computing fields and foster an environment that empowers underrepresented
                    minorities with technological aspirations through <span style={{ color: '#265999' }}>3 pillars:</span></h6>
            </div>
            <div className="pillars">
                <img src={academic} className="pillar"></img>
                <img src={community} className="pillar"></img>
                <img src={profdev} className="pillar"></img>
            </div>
            <div className="stats">
                <div className="stats-block">
                    <h1 className="greenTop">FOUNDED</h1>
                    <h2 className="stats-block bottom">2016</h2>
                </div>
                <div className="stats-block">
                    <h1 className="greenTop">ACTIVE MEMBERS</h1>
                    <h2 className="stats-block bottom">150+</h2>
                </div>
                <div className="stats-block">
                    <h1 className="greenTop">SPONSORS</h1>
                    <h2 className="stats-block bottom">15</h2>
                </div>
            </div>
            <div>
            </div>
        </about_us>
    }
}

export default About_us;