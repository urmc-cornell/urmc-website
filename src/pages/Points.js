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

    const [data, setState] = useState([]);
    const apiGet = () => {
        // fetch(fullURL)
        // .then(response => response.text())
        // .then(data => document.getElementById("json").innerHTML=myItems(data.substring(47).slice(0, -2)))
        // .then(json => console.log(json));

        fetch(fullURL)
        .then(response => response.text())
        .then(data => {
            var json = JSON.parse(data.substring(47).slice(0, -2))
            var netid = document.getElementById("netID").value;
            var dataToLog = data; 

            for (var i=0; i < json["table"]["rows"].length; i++){
                if (json["table"]["rows"][i]["c"][1]["v"] === netid) {
                    setState(json["table"]["rows"][i]["c"][2]["v"]);
                    console.log(json["table"]["rows"][i]["c"][2]["f"]);
                    break;
                }
            }

        
        })
        .catch(error => console.error('Error:', error));

        
    };
    


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
                            <button onClick={apiGet}>Get Points</button>
                        </form>
                    </div>
                </div>

            </div>
            


                {/* Text field to check points */}

            
            
        </div>
    );
}