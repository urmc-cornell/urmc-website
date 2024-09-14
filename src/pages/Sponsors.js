import '../styles/sponsors.css';
import '../styles/home.css'
import janestreet from '../images/sponsors/jane-street.png';
import capitalone from '../images/sponsors/capital-one.png';
import bloomberg from '../images/sponsors/bloomberg.png';
import duolingo from '../images/sponsors/duolingo.png';
import goldman from '../images/sponsors/goldman.png';
import google from '../images/sponsors/google.png';
import meta from '../images/sponsors/meta.png';
import oracle from '../images/sponsors/oracle.png';
import palantir from '../images/sponsors/palantir.png';
import reddit from '../images/sponsors/reddit.png';
import sony from '../images/sponsors/sony.png';
import thoughtworks from '../images/sponsors/thoughtworks.png';
import uber from '../images/sponsors/uber.png';
import yext from '../images/sponsors/yext.png';
import mastercard from '../images/sponsors/master-card.svg';
import datadog from '../images/sponsors/datadog.svg';
import roblox from '../images/sponsors/roblox.jpeg';
import ey from '../images/sponsors/ey.png'

export default function Sponsors() {
    return (
        <div> 
            <div className="heading"> 
                <h1 className="corporate-sponsors-text"> 2024-2025 CORPORATE SPONSORS </h1>
                <h3 className="thanks">Thank you for all your continued support of our organization!</h3>
            </div>
            <div className="sponsor-tiers">
                <div className="sponsor-section gold-sponsors"> 
                    <a className="btn-small btn-gold">GOLD</a>
                    <img src={janestreet} alt="Jane Street Logo" className="logo gold-logo"></img>
                    {/* <img src={reddit} alt="reddit Logo" className="logo gold-logo"></img> */}
                    {/* <img src={thoughtworks} alt="thoughtworks Logo" className="logo gold-logo"></img> */}


                </div>
                <div className="sponsor-section silver-sponsors"> 
                    <a className="btn-small btn-silver">SILVER</a>
                        {/* <img src={meta} alt="Meta Logo" className="logo"></img> */}
                        <img src={duolingo} alt="duolingo Logo" className="logo"></img>
                        {/* <img src={goldman} alt="goldman Logo" className="logo"></img> */}
                        {/* <img src={yext} alt="yext Logo" className="logo"></img> */}
                        {/* <img src={oracle} alt="oracle Logo" className="logo"></img> */}
                        <img src={capitalone} alt="Capital One Logo" className="logo"></img>
                        <img src={bloomberg} alt="Bloomberg Logo" className="logo bloomberg"></img>

                </div>
                <div className="sponsor-section bronze-sponsors"> 
                    <a className="btn-small btn-bronze">BRONZE</a>
                    <img src={google} alt="google Logo" className="logo bronze-logo"></img>
                    <img src={uber} alt="uber Logo" className="logo uber bronze-logo"></img>
                    <img src={mastercard} alt="master card Logo" className="logo bronze-logo"></img>
                    <img src={datadog} alt="datadog Logo" className="logo bronze-logo"></img>
                    <img src={roblox} alt="roblox Logo" className="logo bronze-logo"></img>
                    <img src={palantir} alt="palantir Logo" className="logo palantir bronze-logo"></img>
                    <img src={ey} alt="ey Logo" className="logo ey bronze-logo"></img>

                    
                </div>
            </div>
            <div className="buttons"> 
                <a class="btn btn-2" href="/getting-involved" target='_self'>GETTING INVOLVED</a>
                <a class="btn btn-1" href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702" target="_blank">DONATE</a>
            </div>
        </div>
    );
}