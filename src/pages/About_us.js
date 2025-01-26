import React, { Component } from 'react'
import academic from '../images/academic_icon.svg';
import community from '../images/community_icon.svg';
import profdev from '../images/prof_icon.svg';
import Carousel from '../components/Carousel';
import AboutUsPillarCard from '../components/AboutUsPillarCard';
import * as Constants from '../Supporting/AboutUsConstants';
import Widget from '../components/Widget';
import academic1 from '../images/sections/academic_1.png'  
import academic2 from '../images/sections/academic_2.png'  
import community1 from '../images/sections/community_1.png'  
import community2 from '../images/sections/community_2.png'  
import community3 from '../images/sections/community_3.png'  
import community4 from '../images/sections/community_4.png' 
import profdev1 from '../images/sections/prof_dev1.png' 
import profdev2 from '../images/sections/prof_dev2.png' 
import profdev3 from '../images/sections/prof_dev3.png' 





class About_us extends Component {

    render() {
        return (
            <about_us className="about-us-page">
                <div className="about-us">
                    <h1 className="about-header">About Us</h1>
                    <h6 className="purpose"> The purpose of Underrepresented Minorities in Computing is to promote diversity
                        within the computing fields and foster an environment that empowers <span className="purpose-bolded"> black </span>, <span className="purpose-bolded">latinx </span>, and <span className="purpose-bolded">indigenous</span> students with technological aspirations through <span className="purpose-bolded">3 pillars:</span></h6>
                </div>

                <div className="pillars">
                    <div className="pillar">
                        <img src={academic} className="pillar-icon"></img>
                        <div className="pillar-text">Academic Support</div>
                    </div>
                    <div className="pillar">
                         <img src={community} className="pillar-icon"></img>
                        <div className="pillar-text">Community Building</div>
                    </div>
                    <div className="pillar">
                        <img src={profdev} className="pillar-icon"></img>
                        <div className="pillar-text">Professional Development</div>
                    </div>
                </div>


                <div className="pillar-sections">
                    <div className="pillar-section">
                        <div className="academic-images">
                            <img src={academic1}  id="academic-1" /> 
                            <img src={academic2} id="academic-2" />
                        </div>

                        <div className="section-content"> 
                            <div className="section-title">Academic Support</div>
                            <div className="section-text">
                                <p>Our wonderful academic chairs work to uphold and facilitate academic success by:</p>
                                <ul>
                                    <li>Creating and overseeing class Slack channels for all CS classes</li>
                                    <li>Regularly hosting office hours</li>
                                    <li>Preparing and hosting prelim review sessions</li>
                                    <li>Collaborating with class TAs and maintaining TA database</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pillar-section">

                        <div className="section-content"> 

                            <div className="section-title">Community Building</div>
                                <div className="section-text">
                                    <p>Outreach, Mentorship, and Social puts all their efforts into strengthening our community by</p>
                                    <ul>
                                        <li>Facilitating our M&M Mentorship Program</li>
                                        <li>Planning and hosting social events like movies, bowling, picnics, etc.</li>
                                        <li>Hosting general body meetings for peer discussion and bonding</li>
                                        <li>Collaborating with clubs like NSBE and SHPE to expand our community reach</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="community-images">
                                    <img src={community1}  id="community-1" /> 
                                    <img src={community2}  id="community-2" /> 
                                    <img src={community3}  id="community-3" /> 
                                    <img src={community4}  id="community-4" /> 
                                    
                            </div>
                        
                    </div>

                    <div className="pillar-section">
                        <div className="profdev-images">
                            <img src={profdev1}  id="profdev-1" /> 
                            <img src={profdev2} id="profdev-2" />
                            <img src={profdev3} id="profdev-3" />
                        </div>

                        <div className="section-content"> 
                            <div className="section-title">Professional Development</div>
                            <div className="section-text">
                                <p>Our amazing professional development and corporate chairs work to promote professional excellence by</p>
                                <ul>
                                    <li>Hosting technical and behavioral mock interviews</li>
                                    <li>Hosting company recruitment events with sponsors</li>
                                    <li>Hosting resume review sessions</li>
                                    <li>Maintaining and sending resumé book to our sponsors</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-bar">
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
                            9
                        </div>
                    </div>
                </div>

                <div className="join-section">
                    <h2 id="join-header">Like What You See?</h2>
                    <div id="join-button">
                        <a id="join-text" href="https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg" target="_blank">JOIN THE COMMUNITY</a>
                    </div>

                </div>

            </about_us>
        )
    }
}

export default About_us;