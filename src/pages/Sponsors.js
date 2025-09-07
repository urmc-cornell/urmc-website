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
import mastercard from '../images/sponsors/master-card.png';
import datadog from '../images/sponsors/datadog.png';
import roblox from '../images/sponsors/roblox.png';
import ey from '../images/sponsors/ey.png'
import linkedin from '../images/sponsors/linkedin.png'
import hrt from '../images/sponsors/hrt.png'
import mckinsey from '../images/sponsors/mckinsey.png'
import visa from '../images/sponsors/visa.png'
import figma from '../images/sponsors/figma.png'
import accenture from '../images/sponsors/accenture.png'
import { useScale } from '../hooks/useScale.js';
import React from 'react';

export default function Sponsors() {
    useScale();
    return (
        <div className='sponsor-page'> 
            <div className="heading"> 
                <h1 className="corporate-sponsors-text"> 2025 Corporate Sponsors </h1>
                <h3 className="thanks">Thank you for all your continued support of our organization!</h3>
            </div>

            <div className="sponsor-tiers">

                <div className="sponsor-section plat-sponsors"> 
                        <a className="btn-small btn-plat">PLATINUM</a>
                        <div className="img-section">
                            <img src={linkedin} alt="linkedin Logo" className="linkedin logo platinum-logo"></img>
                        {/* <img src={reddit} alt="reddit Logo" className="logo gold-logo"></img> */}
                        {/* <img src={thoughtworks} alt="thoughtworks Logo" className="logo gold-logo"></img> */}
                        </div>

                </div>

                <div className="sponsor-section gold-sponsors"> 
                    <a className="btn-small btn-gold">GOLD</a>
                    <div className="img-section">

                    
                    <img src={janestreet} alt="Jane Street Logo" className="janestreet logo gold-logo"></img>
                    {/* <img src={linkedin} alt="linkedin Logo" className="logo gold-logo"></img> */}
                    {/* <img src={reddit} alt="reddit Logo" className="logo gold-logo"></img> */}
                    {/* <img src={thoughtworks} alt="thoughtworks Logo" className="logo gold-logo"></img> */}
                    </div>

                </div>

                <div className="sponsor-section silver-sponsors"> 
                    <a className="btn-small btn-silver">SILVER</a>
                    <div className="img-section">
                        {/* <img src={meta} alt="Meta Logo" className="logo"></img> */}
                        {/* <img src={duolingo} alt="duolingo Logo" className=" duolingo"></img> */}
                        {/* <img src={goldman} alt="goldman Logo" className="logo"></img> */}
                        {/* <img src={yext} alt="yext Logo" className="logo"></img> */}
                        {/* <img src={oracle} alt="oracle Logo" className="logo"></img> */}
                        {/* <img src={capitalone} alt="Capital One Logo" className="duolingo"></img> */}
                        <img src={visa} alt="Visa Logo" className="logo visa silver-logo"></img>
                        <img src={bloomberg} alt="Bloomberg Logo" className="logo bloomberg silver-logo"></img>
                        <img src={hrt} alt="HRT Logo" className="hrt logo silver-logo"></img>
                        {/* <img src={mckinsey} alt="McKinsey Logo" className="mckinsey logo silver-logo"></img> */}
                        <img src={accenture} alt="Accenture Logo" className="logo accenture silver-logo"></img>
                    </div>
                </div>

                <div className="sponsor-section bronze-sponsors"> 
                    <a className="btn-small btn-bronze">BRONZE</a>
                    <div className="img-section">
                        <img src={google} alt="google Logo" className="logo bronze-logo"></img>
                        {/* <img src={uber} alt="uber Logo" className="logo "></img> */}
                        {/* <img src={mastercard} alt="master card Logo" className="logo bronze-logo"></img> */}
                        <img src={datadog} alt="datadog Logo" className="logo bronze-logo"></img>
                        <img src={roblox} alt="roblox Logo" className="logo bronze-logo"></img>
                        {/* <img src={palantir} alt="palantir Logo" className="logo "></img> */}
                        <img src={capitalone} alt="Capital One Logo" className="logo bronze-logo"></img>
                        <img src={ey} alt="ey Logo" className="ey logo bronze-logo"></img>
                        <img src={figma} alt="figma Logo" className="logo bronze-logo"></img>
                    </div>     
                </div>
            </div>

            <div className="buttons"> 
                <a class="btn btn-2" href="/getting-involved" target='_self'>GETTING INVOLVED</a>
                <a class="btn btn-1" href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702" target="_blank">DONATE</a>
            </div>
        </div>
    );
}