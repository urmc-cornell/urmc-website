import '../styles/sponsors.css';
import '../styles/home.css'; 
import '../styles/Leadership.css'; 
import '../styles/about_us.css'; 
import '../styles/points.css';

import React, { useState, useEffect } from 'react'

let sheetID = "1Gmj6r89FF-QDD4NbBRG7nXKXjcQGUZbO6ddVM359H6k"
let sheetTitle = "Points"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let sheetRange = 'A2:C200'
let fullURL = ("https://docs.google.com/spreadsheets/d/" + sheetID + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange);

export default function Points() {

    const [points, setPoints] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);

    // Function to fetch points for a specific netID
    const fetchPoints = async (netid) => {
        try {
            const response = await fetch(`http://localhost:5000/api/points/${netid}`);
            const data = await response.json();
            setPoints(`${data.total_points} Points`);
        } catch (error) {
            console.error('Error fetching points:', error);
            setPoints('Error fetching points');
        }
    };

    // Fetch leaderboard on component mount

    // change to query DB 
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/leaderboard');
                const data = await response.json();
                const formattedLeaderboard = data.map(entry => 
                    `${entry.first_name} ${entry.last_name}: ${entry.total_points} Points`
                );
                setLeaderboard(formattedLeaderboard);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div style={{ height: 1000, overflow: 'auto' }}>
            <div className="heading"> 
                <h1 className="Points"> Points Tracking </h1>
                <h3 className="subheader">URMC Collects Points To Reward Active Members</h3>
                
                {/* Main content container */}
                <div className="points-container">
                    {/* Left side - Points Breakdown */}
                    <div className="points-section">
                        <h2 className="fall22">Earning Points</h2>
                        <h3 className="thanks">Members can earn points by...</h3>
                    
                        <div className="points-boxes">
                            <div className="points-box green">
                                <span className="points">3 Points</span>
                                <span className="description">Attending events and completing the attendance form</span>
                            </div>
                            <div className="points-box orange">
                                <span className="points">2 Points</span>
                                <span className="description">Attending a non G-Body event</span>
                            </div>
                            <div className="points-box yellow">
                                <span className="points">1 Point</span>
                                <span className="description">Responding to URMC forms</span>
                            </div>
                        </div>

                        {/* Points lookup form */}
                        <div className="view_points">
                            <h2 className="fall22">View Points</h2>
                            <h3 className="subheader">Enter your netID below to see your points</h3>
                            
                            <div className="netID input">
                                <form id="points-form">
                                    <input type="text" id="netID" name="netID" placeholder="Enter netID here"></input>  
                                    <button type="submit" id="myButton" onClick={fetchPoints}>Get Points</button>
                                    <h3 className="subheader">{points}</h3>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Leaderboard */}
                    <div className="leaderboard-section">
                        <h2>Leaderboard</h2>
                        <div className="fall22">
                            <ol className="subheader">
                                <li>{leaderboard[0]}</li>
                                <li>{leaderboard[1]}</li>
                                <li>{leaderboard[2]}</li>
                                <li>{leaderboard[3]}</li>
                                <li>{leaderboard[4]}</li>
                                <li>{leaderboard[5]}</li>
                                <li>{leaderboard[6]}</li>
                                <li>{leaderboard[7]}</li>
                                <li>{leaderboard[8]}</li>
                                <li>{leaderboard[9]}</li>
                            </ol> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}