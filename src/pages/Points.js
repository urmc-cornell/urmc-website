import '../styles/sponsors.css';
import '../styles/home.css'; 
import '../styles/Leadership.css'; 
import '../styles/about_us.css'; 
import '../styles/points.css'; 


export default function Points() {
    return (
        <div> 
            <div className="heading"> 
                <h1 className="Points"> Points Tracking </h1>
                <h3 className="subheader">URMC Collects Points To Reward Active Members</h3>
                
                {/* Point Breakdown */}
                <div className="subheader">
                    <h2 className="fall22">Earning Points</h2>
                    <h3 className="thanks">Members can earn points by...</h3>
                
                    <div className="fall22">
                        <ul>
                            <li>Attending events and completing the attendance form.</li>
                            <li>Participating in mentor matching as a mentor or mentee.</li>
                            <li>and doing something else....</li>
                        </ul>
                    </div>
                </div>

                <div className="view_points">
                    <h2 className="fall22">View Points</h2>
                    <h3 className="subheader">Enter your netID below to see your points</h3>
                    
                    <div className="netID input">
                        <form id="points-form" action="#">
                            <input type="text" id="netID" name="netID" placeholder="Enter netID here"></input>
                    
                        </form>
                    </div>
                </div>

            </div>
            


                {/* Text field to check points */}

            
            
        </div>
    );
}