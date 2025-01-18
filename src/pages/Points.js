import "../styles/sponsors.css";
import "../styles/home.css";
import "../styles/Leadership.css";
import "../styles/about_us.css";
import "../styles/points.css";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function Points() {
  let semester = "sp25";
  // State for individual points lookup and leaderboard
  const [points, setPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch points for a specific netID
  const fetchPoints = async (netid) => {
    try {
      // Query the members table and fetch related points_tracking
      const { data, error } = await supabase
        .from("members")
        .select(
          "netid, points_tracking!points_tracking_member_id_fkey (points)"
        )
        // Filter where the members netid and the points semester matches our search
        .eq("netid", netid.toLowerCase())
        .eq("points_tracking.semester", semester)
        // Ensures only one record is returned (specific to the netid)
        .single();

      //Handle errors from the query
      if (error) {
        console.error("Error fetching points:", error);
        setPoints("NetID Not Found");
        return;
      }

      if (!data || !data.points_tracking) {
        setPoints("NetID Not Found");
        return;
      }

      // Calculate total points only for current semester
      const totalPoints =
        data.points_tracking.reduce((sum, record) => sum + record.points, 0) ||
        0;
      setPoints(`${totalPoints} Points`);
    } catch (error) {
      console.error("Unexpected error:", error);
      setPoints("Error fetching points");
    }
  };

  // Fetch leaderboard data when component first mounts
  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // Query Supabase database to get all members and their associated points
        const { data, error } = await supabase.from("members").select(
          // Using a join between members table and points_tracking table
          "netid, points_tracking!points_tracking_member_id_fkey (points, semester)"
        );

        // If query returns an error, throw it to be caught
        if (error) throw error;

        // Process the returned data:
        // 1. Map each member to an object with their netid and total points
        // 2. Sort members by total points in descending order
        // 3. Take only top 10 members for leaderboard
        const boardData = data
          .map((member) => ({
            netid: member.netid,
            // Only sum points for current semester
            totalPoints: member.points_tracking
              .filter((record) => record.semester === semester)
              .reduce((sum, record) => sum + record.points, 0),
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 10);

        // Format the leaderboard data into strings for display
        // Example format: "netid: 25 Points"
        const board = boardData.map(
          (item) => `${item.netid}: ${item.totalPoints} Points`
        );

        // Update the leaderboard state with formatted data
        setLeaderboard(board);
      } catch (error) {
        // Log any errors that occur during the process
        console.error("Error fetching leaderboard: ", error);
      }
    }

    // Call the fetchLeaderboard function
    fetchLeaderboard();
  }, []); // Empty dependency array means this effect runs only once when component mounts

  // Handle individual points lookup
  const point_set = async (event) => {
    event.preventDefault(); // Do not delete this line, stops page from refreshing
    const netid = document.getElementById("netID").value;
    await fetchPoints(netid);
  };

  return (
    <div style={{ height: 1000, overflow: "auto" }} className="points-page">
      <div className="heading">
        <h1 className="Points"> Points Tracking </h1>
        <h3 className="subheader">
          URMC Collects Points To Reward Active Members
        </h3>

        {/* Main content container */}
        <div className="points-container">
          {/* Left side - Points Breakdown */}
          <div className="points-section">
            <h2 className="fall22">Earning Points</h2>
            <h3 className="thanks">Members can earn points by...</h3>

            <div className="points-boxes">
              <div className="points-box green">
                <span className="points">3 Points</span>
                <span className="description">
                  Attending events and completing the attendance form
                </span>
              </div>
              <div className="points-box orange">
                <span className="points">2 Points</span>
                <span className="description">
                  Attending a non G-Body event
                </span>
              </div>
              <div className="points-box yellow">
                <span className="points">1 Point</span>
                <span className="description">Responding to URMC forms</span>
              </div>
            </div>

            {/* Points lookup form */}
            <div className="view_points">
              <h2 className="fall22">View Points</h2>
              <h3 className="subheader">
                Enter your netID below to see your points
              </h3>

              <div className="netID input">
                <form
                  id="points-form"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <input
                    type="text"
                    id="netID"
                    name="netID"
                    placeholder="Enter netID here"
                    style={{
                      padding: "12px 20px",
                      fontSize: "16px",
                      borderRadius: "25px",
                      border: "2px solid #e0e0e0",
                      width: "250px",
                      outline: "none",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                  <button
                    type="submit"
                    id="myButton"
                    onClick={point_set}
                    style={{
                      padding: "12px 30px",
                      fontSize: "16px",
                      borderRadius: "25px",
                      border: "none",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    Get Points
                  </button>
                  <h3 className="subheader">{points}</h3>
                </form>
              </div>
            </div>
          </div>

          {/* Right side - Leaderboard */}
          <div className="leaderboard-section">
            <h2>Leaderboard</h2>
            <div className="fall22">
              <ul
                className="subheader"
                style={{ textAlign: "left", paddingLeft: "20px" }}
              >
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
