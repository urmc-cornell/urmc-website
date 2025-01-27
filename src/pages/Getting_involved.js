import '../styles/getting_involved.css';
import '../styles/home.css'
import { useScale } from '../hooks/useScale';
import React from 'react';


export default function Getting_involved() {
    useScale();
    return (
        <div className="getting-involved-page">
            <h1 className="getting-involved">Getting Involved</h1>
            <div className='grid-container'>
                <div className='grid-item'> 
                    <div className="text-background">
                        <h1 className='header-text'> STUDENTS </h1>
                        <h3 className='subheader-text'>Find out about <span className="text-bold">URMC events</span>, on-campus and off-campus <span className="text-bold">opportunities</span>, and other events happening within the <span className="text-bold">CIS community</span>!</h3>
                    </div>
                    <div className='button-div'> 
                        <a class="btn btn-1" href="https://join.slack.com/t/urmc/shared_invite/zt-2dy8ndtoy-~6zcRR2skt7Z5iT5iAyIBg" target="_blank">JOIN THE SLACK</a>
                    </div>
                </div>
                <div className='grid-item'> 
                    <div className="text-background">
                        <h1 className='header-text'> COMPANIES </h1>
                        <h3 className='subheader-text'><span className="text-bold">Send us an email</span> to connect with our Corporate directors and receive our Sponsorship Packet! You won't regret it!</h3>
                    </div>
                    <div className='button-div'> 
                        <a class="btn btn-1" href="mailto:urmc@cornell.edu" target="_blank">SPONSOR US</a> 
                    </div>
                </div>
            </div>

            <div className='grid-container'>
                <div className='grid-item'> 
                    <div className="text-background">
                        <h1 className='header-text'> ALUMNI </h1>
                        <h3 className='subheader-text'>Are you an <span className="text-bold">alumni</span> who wants to keep up with URMC? <span className="text-bold">Sign up</span> to receive updates about URMC events and opportunities to get involved!</h3>
                    </div>
                    <div className='button-div'> 
                        <a class="btn btn-1" href="https://docs.google.com/forms/d/e/1FAIpQLSc8c-drC3WBcVMqknx09q6-cBWRYeCbZYN1tBu98RM4CuDoTg/viewform" target="_blank">JOIN THE LISTSERV</a>
                    </div>
                </div>
                <div className='grid-item'> 
                    <div className="text-background">
                        <h1 className='header-text'> DONATIONS </h1>
                        <h3 className='subheader-text'>Help URMC continue to have the resources to <span className="text-bold">empower</span> URM's in tech to accomplish their <span className="text-bold">dreams</span>.</h3>
                    </div>
                    <div className='button-div'> 
                        <a class="btn btn-1" href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702" target="_blank">DONATE</a>
                    </div>
                </div>
            </div>
            <p></p>
        </div>
    );
}