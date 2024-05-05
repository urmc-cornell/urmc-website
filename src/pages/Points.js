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

    const [points, setPoints] = useState([]);
    const [json, setJson] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch(fullURL);
          const data = await response.text();
          const jsonData = JSON.parse(data.substring(47).slice(0, -2));
          setJson(jsonData);


          let board = [];
          for (let i = 0; i < 3; i++) {
            var str = json["table"]["rows"][i]["c"][1]["v"].toLowerCase() + ": " + json["table"]["rows"][i]["c"][2]["f"] + " Points";
            board.push(str);
          }
          setLeaderboard(board)

        } catch (error) {
          console.error('Error:', error);
        } 
      }
      fetchData();
    }, [json]);

    

    const point_set = (event) => {
      event.preventDefault(); // Do not delete this line, stops page from refreshing
      const netid = document.getElementById("netID").value;
      var found = false;

      for (let i = 0; i < json["table"]["rows"].length; i++) {
        
        if (json["table"]["rows"][i]["c"][1]["v"].toLowerCase() == netid.toLowerCase()) {
          found = true;
          setPoints("Points: " + json["table"]["rows"][i]["c"][2]["f"]);
          break;
        }
      }
      if (!found) {
        setPoints("NetID Not Found");
      }
    }


    return (
        <div style={{ height: 1000, overflow: 'auto' }}>
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
                        <form id="points-form">
                            <input type="text" id="netID" name="netID" placeholder="Enter netID here"></input>  
                            <button type="submit" id="myButton" onClick={point_set}>Get Points</button>
                            <h3 className="subheader">{points}</h3>
                            
                        </form>
                        {/* leaderboard */}
                        <h2>Leaderboard</h2>
                        <div className="fall22">
                          <ol className="subheader">
                                  <li>{leaderboard[0]}</li>
                                  <li>{leaderboard[1]}</li>
                                  <li>{leaderboard[2]}</li>
                          </ol> 
                      </div>
                    </div>
                </div>
            </div>
                {/* Text field to check points */}
        </div>
    );
}