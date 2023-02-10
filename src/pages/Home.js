import group from '../images/urmcSP22.png';
import blue_ellipse from '../images/blue_ellipse.png';
import yellow_ellipse from '../images/yellow_ellipse.png';

export default function Home() {
    return <home>
        <h1 className="header">UNDERREPRESENTED MINORITIES IN COMPUTING</h1>
        <h2 className="sub-header">Building a supportive community where all can find success.</h2>
        <div className="flexbox-container">
            <a class="btn btn-1" href="https://urmc.slack.com/join/shared_invite/zt-984krsoy-9lIJn2XrJOx1NuQUtKc40w" target="_blank">JOIN THE COMMUNITY</a>
            <a class="btn btn-2" href="/about-us">LEARN MORE</a>
        </div>
        
        <div className="images">
            <img src={blue_ellipse} className="blue_ellipse"></img>
            <img src={yellow_ellipse} className="yellow_ellipse"></img>
            <img src={group} className="group"></img>
        </div>
    </home>
}