import '../styles/getting_involved.css';
import '../styles/home.css'


export default function Getting_involved() {
    return (
        <div>
            <h1 className="getting-involved">Getting Involved</h1>
            {/* TODO NEED LISTSERV LINK from email */}
            <div className='flexbox-container'>
                <div className='info-card-row'> 
                    <div className='info-card'> 
                        <div className="text-background">
                            <h1 className='header-text'> STUDENTS </h1>
                            <h3 className='subheader-text'>Find out about URMC events, on-campus and off-campus opportunities, and other events happening within the CIS community!</h3>
                        </div>
                        <div className='button-div'> 
                            <a class="btn btn-2" href="https://docs.google.com/forms/d/e/1FAIpQLSc8c-drC3WBcVMqknx09q6-cBWRYeCbZYN1tBu98RM4CuDoTg/viewform" target="_blank">JOIN THE LISTSERV</a>
                        </div>
                    </div>
                    <div className='info-card'> 
                        <div className="text-background">
                            <h1 className='header-text'> COMPANIES </h1>
                            <h3 className='subheader-text'>Send us an email to connect with our Corporate directors and receive our Sponsorship Packet!</h3>
                        </div>
                        <div className='button-div'> 
                            <a class="btn btn-1" href="" target="_blank">SPONSOR US</a> 
                        </div>
                    </div>
                    <div className='info-card'> 
                        <div className="text-background">
                            <h1 className='header-text'> ALUMNI </h1>
                            <h3 className='subheader-text'>Are you an alumni who wants to keep up with URMC? Sign up to receive updates about URMC events and opportunities to get involved! </h3>
                        </div>
                        <div className='button-div'> 
                            <a class="btn btn-2" href="https://docs.google.com/forms/d/e/1FAIpQLSc8c-drC3WBcVMqknx09q6-cBWRYeCbZYN1tBu98RM4CuDoTg/viewform" target="_blank">JOIN THE LISTSERV</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>






    );
}