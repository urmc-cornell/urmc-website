import '../styles/sponsors.css';
import '../styles/home.css'; 
import '../styles/Leadership.css'; 
import '../styles/about_us.css'; 
import '../styles/points.css';

import React, { useState } from 'react'

let sheetID = "1Gmj6r89FF-QDD4NbBRG7nXKXjcQGUZbO6ddVM359H6k"
let sheetTitle = "Points"
//SHEET_RANGE might have to be changed if we ever have >30 events, but probably not
let sheetRange = 'A2:C200'
let fullURL = ("https://docs.google.com/spreadsheets/d/" + sheetID + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange);

export default function Points() {

    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState([]);

    // leaderboard
    // const [first, setFirst] = useState([]);
    // const [second, setSecond] = useState([]);
    // const [third, setThird] = useState([]);

    // let netID = [];
    // let point = [];
    
    // for (let i = 0; i < json["table"]["rows"].length; i++) {
    //     netID.push(json["table"]["rows"][i]["c"][1]["v"].toLowerCase());
    //     points.push(json["table"]["rows"][i]["c"][2]["f"]);
    // }
    // setFirst(netID[0] + ": " + point[0] + " Points");
    // setSecond(netID[1] + ": " + point[1] + " Points");
    // setThird(netID[2] + ": " + point[2] + " Points");

    const apiGet = async () => {
        try {
          setLoading(true); // Set loading to true before fetching
          const response = await fetch(fullURL);
          const data = await response.text();
          const json = JSON.parse(data.substring(47).slice(0, -2));
          const netid = document.getElementById("netID").value;
          var found = false;

          for (let i = 0; i < json["table"]["rows"].length; i++) {
           
            if (json["table"]["rows"][i]["c"][1]["v"].toLowerCase() == netid.toLowerCase()) {
              found = true;
              setPoints("Points: " + json["table"]["rows"][i]["c"][2]["f"]);
              console.log(points);
              break;
            }
          }


          if (!found) {
            setPoints("NetID Not Found");
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

    const waiting = () => {
        if (loading) {
            return <div>Loading...</div>;
          }
    };

    function handleSubmit(event) {
        event.preventDefault(); // Prevent the form from actually submitting
        if (event.key === 'Enter') {
            apiGet();
        }
        
    }
    const pointsForm = document.getElementById("points-form");
    // pointsForm.addEventListener("submit", handleSubmit);
    
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
                        <form id="points-form" action="#">
                            <input type="text" id="netID" name="netID" placeholder="Enter netID here"></input>  
                            <button type="submit" id="myButton" onClick={apiGet}>Get Points</button>
                            <h3 className="subheader">{waiting}{points}</h3>
                            
                        </form>
                        {/* leaderboard */}
                        {/* <h3 className="subheader">Leaderboard</h3>
                        <ol className="fall22">
                                <li>{first}</li>
                                <li>{second}</li>
                                <li>{third}</li>
                        </ol> */}
                    </div>
                </div>

            </div>
            


                {/* Text field to check points */}

            
            
        </div>
    );
}