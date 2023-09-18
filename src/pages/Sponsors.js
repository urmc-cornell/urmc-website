import '../styles/sponsors.css';
import '../styles/home.css'
import janestreet from '../images/sponsors/jane-street.png';
import capitalone from '../images/sponsors/capital-one.png';
import bloomberg from '../images/sponsors/bloomberg.png';



export default function Sponsors() {
    return (
        <div> 
            <div className="heading"> 
                <h1 className="corporate-sponsors-text"> 2023-2024 CORPORATE SPONSORS </h1>
                <h3 className="thanks">Thank you for all your continued support of our organization!</h3>
            </div>
            <div className="sponsor-tiers">
                <div className="sponsor-section gold-sponsors"> 
                    <a className="btn-small btn-gold">GOLD</a>
                    <img src={janestreet} alt="Jane Street Logo" className="logo"></img>
                </div>
                <div className="sponsor-section silver-sponsors"> 
                    <a className="btn-small btn-silver">SILVER</a>
                    <img src={capitalone} alt="Capital One Logo" className="logo"></img>
                    <img src={bloomberg} alt="Bloomberg Logo" className="logo"></img>

                </div>
                <div className="sponsor-section bronze-sponsors"> 
                    <a className="btn-small btn-bronze">BRONZE</a>
                </div>
            </div>
            <div className="buttons"> 
                <a class="btn btn-2" href="/getting-involved" target='_self'>GETTING INVOLVED</a>
                <a class="btn btn-1" href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702" target="_blank">DONATE</a>
            </div>
        </div>
    );
}