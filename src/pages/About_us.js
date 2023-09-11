import React, { Component } from 'react'
import academic from '../images/academic.png';
import community from '../images/community.png';
import profdev from '../images/profdev.png';
import Carousel from '../components/Carousel';
import AboutUsPillarCard from '../components/AboutUsPillarCard';
import * as Constants from '../Supporting/StringConstants';
import Widget from '../components/Widget';

class About_us extends Component {

    render() {
        return (
            <about_us className="about-us-page">
                <div>
                    <div className="about-us">
                        <h1>About Us</h1>
                    </div>
                    <div className="about-us">
                        <h6 className="purpose"> The purpose of Underrepresented Minorities in Computing is to promote diversity
                            within the computing fields and foster an environment that empowers underrepresented
                            minorities with technological aspirations through <span style={{ color: '#265999' }}>3 pillars:</span></h6>
                    </div>
                </div>

                <div className="pillars">
                    <img src={academic} className="pillar"></img>
                    <img src={community} className="pillar"></img>
                    <img src={profdev} className="pillar"></img>
                </div>

                <div className="academic-support">
                    
                    <div className="academic-top">
                        <Carousel></Carousel>
                        <AboutUsPillarCard title={Constants.AcademicCard.CardTitle} body={Constants.AcademicCard.CardBody}></AboutUsPillarCard>
                    </div>
                    <div className="widgets">
                        {/* <Widget></Widget>
                        <Widget></Widget>
                        <Widget></Widget>
                        <Widget></Widget> */}
                    </div>
                </div>
            </about_us>
        )
    }
}

export default About_us;