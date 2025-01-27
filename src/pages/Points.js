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
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(fullURL);
            const data = await response.text();
            const jsonData = JSON.parse(data.substring(47).slice(0, -2));

            let board = [];
            for (let i = 0; i < 10; i++) {
              var str = jsonData["table"]["rows"][i]["c"][1]["v"].toLowerCase() + ": " + jsonData["table"]["rows"][i]["c"][2]["f"] + " Points";
              board.push(str);
            }
            setLeaderboard(board)
  
          } catch (error) {
            console.error('Error:', error);
          } 
        }
        fetchData();
      }, []); // Empty dependency array since we only want to fetch once on mount


      const point_set = async (event) => {
        event.preventDefault(); // Do not delete this line, stops page from refreshing
        const netid = document.getElementById("netID").value;
        var found = false;
  
        try {
          const response = await fetch(fullURL);
          const data = await response.text();
          const jsonData = JSON.parse(data.substring(47).slice(0, -2));
          
          for (let i = 0; i < jsonData["table"]["rows"].length; i++) {
            if (jsonData["table"]["rows"][i]["c"][1]["v"].toLowerCase() === netid.toLowerCase()) {
              found = true;
              setPoints("Points: " + jsonData["table"]["rows"][i]["c"][2]["f"]);
              break;
            }
          }
          if (!found) {
            setPoints("NetID Not Found");
          }
        } catch (error) {
          console.error('Error:', error);
          setPoints("Error fetching points");
        }
      }

    return (
        <div className="points-page">
            <h1 className="points">Points</h1>
            
            <div className="points-container">
                    <h2 className="section-title">Point Allocation</h2>
                    <div className="points-allocation">
                        <div className="point-group">
                            <span className="point-value">+1 Point</span>
                            <div className="point-descriptions">
                                <div className="point-item">
                                    <span className="point-description">Event Attendance</span>
                                </div>
                                <div className="point-item">
                                    <span className="point-description">Updating Academic Folder (Max 3)</span>
                                </div>
                            </div>
                        </div>
                        <div className="point-group">
                            <span className="point-value">+2 Point</span>
                            <div className="point-descriptions">
                                <div className="point-item">
                                    <span className="point-description">Event Attendance as a TA (eg. review session)</span>
                                </div>
                            </div>
                        </div>
                        <div className="point-group">
                            <span className="point-value">+3 Point</span>
                            <div className="point-descriptions">
                                <div className="point-item">
                                    <span className="point-description">Be a mentor/mentee (meet atleast once)</span>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            <div className="points-container">

                    <h2 className="section-title">Point Rewards</h2>
                    <div className="rewards-grid">
                        <div className="reward-card">
                            <h3 className="reward-title">{"Resume\nBook"}</h3>
                            <p className="reward-value">5 Points</p>
                        </div>
                        <div className="reward-card">
                            <h3 className="reward-title">{"Conference\nScholarships"}</h3>
                            <p className="reward-value">Top Earners</p>
                        </div>
                        <div className="reward-card">
                            <h3 className="reward-title">{"G-Body\nPrizes"}</h3>
                            <p className="reward-value">Every 5 Points</p>
                        </div>
                    </div>
            </div>

            <div className="view-points">
                <h1>View Points</h1>
                <h2>Enter your netid below to see your points</h2>
                <form id="points-form">
                    <input 
                        type="text" 
                        id="netID" 
                        name="netID" 
                    />  
                    <button 
                        type="submit" 
                        id="myButton" 
                        onClick={point_set}
                    >
                        Get Points
                    </button>
                    <h3>{points}</h3>
                </form>
            </div>
        </div>
    );
}