import '../styles/sponsors.css';
import '../styles/home.css'


export default function Sponsors() {
    return (
        <div> 
            <div className="heading"> 
                <h1 className="corporate sponsors text"> 2023-2024 CORPORATE SPONSORS </h1>
                <h3 className="thanks">Thank you for all your continued support of our organization!</h3>
            </div>
            <div className="sponsor-tiers">
                <div className="gold-sponsors"> 
                    <h3> Placeholder text for now </h3>
                </div>
                <div className="silver-sponsors"> 
                    <h3> Placeholder text for now </h3>
                </div>
                <div className="bronze-sponsors"> 
                    <h3> Placeholder text for now </h3>
                </div>
            </div>
            <div className="buttons"> 
                <a class="btn btn-2" href="/getting-involved" target="_blank">GETTING INVOLVED</a>
                <a class="btn btn-1" href="https://securelb.imodules.com/s/1717/giving/interior.aspx?sid=1717&gid=2&pgid=16421&bledit=1&dids=702" target="_blank">DONATE</a>
            </div>
        </div>
    );
}