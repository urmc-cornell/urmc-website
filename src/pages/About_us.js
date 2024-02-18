import React, { Component } from 'react'
import academic from '../images/academic.png';
import community from '../images/community.png';
import profdev from '../images/profdev.png';
import Carousel from '../components/Carousel';
import AboutUsPillarCard from '../components/AboutUsPillarCard';
import * as Constants from '../Supporting/AboutUsConstants';
import Widget from '../components/Widget';  



class About_us extends Component {

    render() {
        return (
            <about_us className="about-us-page">
                <div className="about-us">
                    <h1>About us</h1>
                    <h6 className="purpose"> The purpose of Underrepresented Minorities in Computing is to promote diversity
                        within the computing fields and foster an environment that empowers underrepresented
                        minorities with technological aspirations through <span style={{ color: '#265999' }}>3 pillars:</span></h6>
                </div>

                <div className="pillars">
                    <img src={academic} className="pillar"></img>
                    <img src={community} className="pillar"></img>
                    <img src={profdev} className="pillar"></img>
                </div>

                <div className="stats-bar">
                    <div className="stats">
                        <div className="stats-item">
                            <div className="stats-header">
                                FOUNDED
                            </div>
                            <div className="stats-number">
                                2016
                            </div>
                        </div>
                        <div className="stats-item">
                            <div className="stats-header">
                                ACTIVE MEMBERS
                            </div>
                            <div className="stats-number">
                                150+
                            </div>
                        </div>
                        <div className="stats-item">
                            <div className="stats-header">
                                SPONSORS
                            </div>
                            <div className="stats-number">
                                15
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pillar-sections">
                    <div className="academic-support">
                        <div className="academic-title">ACADEMIC SUPPORT</div>
                        <div className="academic-cards">
                            <Carousel pics={Constants.Academic.CarouselImages}></Carousel>
                            <AboutUsPillarCard title={Constants.Academic.Card.title} body={Constants.Academic.Card.body}></AboutUsPillarCard>
                        </div>
                        <div className="academic-widgets">
                            <div className="widget-row">
                                <Widget image={Constants.Academic.Widget.Slack.icon} title={Constants.Community.Widget.Slack.body} body={Constants.Academic.Widget.Slack.body}></Widget>
                                <Widget image={Constants.Academic.Widget.Exam.icon} title={Constants.Academic.Widget.Exam.title} body={Constants.Academic.Widget.Exam.body}></Widget>
                            </div>
                            <div className="widget-row">
                                <Widget image={Constants.Academic.Widget.Study.icon} title={Constants.Academic.Widget.Study.title} body={Constants.Academic.Widget.Study.body}></Widget>
                                <Widget image={Constants.Academic.Widget.TA.icon} title={Constants.Academic.Widget.TA.title} body={Constants.Academic.Widget.TA.body}></Widget>
                            </div>
                        </div>
                    </div>

                    <div className="academic-support">
                        <div className="academic-title" style={{ color: "#86739F" }}>COMMUNITY BUILDING</div>
                        <div className="academic-cards">
                            <Carousel color="#D9CCEA" pics={Constants.Community.CarouselImages}></Carousel>
                            <AboutUsPillarCard title={Constants.Community.Card.title} body={Constants.Community.Card.body} color="#D9CCEA" textColor="#86739F"></AboutUsPillarCard>
                        </div>
                        <div className="academic-widgets">
                            <div className="widget-row">
                                <Widget image={Constants.Community.Widget.Slack.icon} title={Constants.Community.Widget.Slack.body} body={Constants.Community.Widget.Slack.body}></Widget>
                                <Widget image={Constants.Community.Widget.Exam.icon} title={Constants.Community.Widget.Exam.title} body={Constants.Community.Widget.Exam.body}></Widget>
                            </div>
                            <div className="widget-row">
                                <Widget image={Constants.Community.Widget.Study.icon} title={Constants.Community.Widget.Study.title} body={Constants.Community.Widget.Study.body}></Widget>
                                <Widget image={Constants.Community.Widget.TA.icon} title={Constants.Community.Widget.TA.title} body={Constants.Community.Widget.TA.body}></Widget>
                            </div>
                        </div>
                    </div>

                    <div className="academic-support">
                        <div className="academic-title" style={{ color: "#B95F37" }}>PROFESSIONAL DEVELOPMENT</div>
                        <div className="academic-cards">
                            <Carousel color="#FBBFA4" pics={Constants.Professional.CarouselImages}></Carousel>
                            <AboutUsPillarCard title={Constants.Professional.Card.title} body={Constants.Professional.Card.body} color="#FBBFA4" textColor="#B95F37"></AboutUsPillarCard>
                        </div>
                        <div className="academic-widgets">
                            <div className="widget-row">
                                <Widget image={Constants.Professional.Widget.Slack.icon} title={Constants.Professional.Widget.Slack.body} body={Constants.Professional.Widget.Slack.body}></Widget>
                                <Widget image={Constants.Professional.Widget.Exam.icon} title={Constants.Professional.Widget.Exam.title} body={Constants.Professional.Widget.Exam.body}></Widget>
                            </div>
                            <div className="widget-row">
                                <Widget image={Constants.Professional.Widget.Study.icon} title={Constants.Professional.Widget.Study.title} body={Constants.Professional.Widget.Study.body}></Widget>
                                <Widget image={Constants.Professional.Widget.TA.icon} title={Constants.Professional.Widget.TA.title} body={Constants.Professional.Widget.TA.body}></Widget>
                            </div>
                        </div>
                    </div>
                </div>
            </about_us>
        )
    }
}

export default About_us;