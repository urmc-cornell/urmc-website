import "../styles/points.css";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { currentSemester, currentSemesterLabel } from "../lib/semester.js";

export default function Points() {
  const semester = currentSemester();
  const [points, setPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [topThree, setTopThree] = useState([]);

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

    fetchLeaderboard();

    const excludedNetids = new Set([
      "ryg4", "zas36", "bm734", "saf274", "ga362", "jcp349", "kab472",
      "jwj68", "bbm56", "jce79", "ta375", "doa8", "reb368", "lyb4",
      "ga324", "nt387", "jt938", "asa253","ce248", "as3734", "fmi4", 
      "ya287", "ele54", "ym582", "dfb222",
    ]);

    async function fetchTopThree() {
      try {
        const { data, error } = await supabase
          .from("members")
          .select(
            "netid, points_tracking!points_tracking_member_id_fkey (points, semester)"
          );

        if (error) throw error;

        const ranked = data
          .map((m) => ({
            netid: m.netid,
            totalPoints: m.points_tracking
              .filter((r) => r.semester === semester)
              .reduce((sum, r) => sum + r.points, 0),
          }))
          .filter((m) => m.totalPoints > 0 && !excludedNetids.has(m.netid))
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 3);

        setTopThree(ranked);
      } catch (err) {
        console.error("Error fetching top three:", err);
      }
    }

    fetchTopThree();
  }, []);

  // Handle individual points lookup
  const point_set = async (event) => {
    event.preventDefault(); // Do not delete this line, stops page from refreshing
    const netid = document.getElementById("netID").value;
    await fetchPoints(netid);
  };

    return (
   <div className="points-page">
     <h1 className="points">Points</h1>

     {/* POINT ALLOCATION */}
     <div className="points-container">
       <h2 className="container-title">Point Allocation ({currentSemester().toUpperCase()})</h2>


       <div className="points-allocation">


         <div className="point-group">
           <span className="point-value">Community</span>
           <div className="point-descriptions">
             <div className="point-item">
               <span className="point-description">
                 General Body Meeting — 3 pts (Max 9)
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 General Body Social — 5 pts (Max 15)
               </span>
             </div>
           </div>
         </div>


         <div className="point-group">
           <span className="point-value">Mentorship</span>
           <div className="point-descriptions">
             <div className="point-item">
               <span className="point-description">
                 Join Mentorship — 4 pts
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Mentorship Meeting — 1 pt (Max 5)
               </span>
             </div>
           </div>
         </div>


         <div className="point-group">
           <span className="point-value">Professional Development</span>
           <div className="point-descriptions">
             <div className="point-item">
               <span className="point-description">
                 Corporate Meeting — 1 pt (Max 4)
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Pre-Professional Dev Meeting — 2 pts (Max 10)
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Website / Web Dev Event — 4 pts
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Design Event — 4 pts
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Alumni Event — 2 pts
               </span>
             </div>
           </div>
         </div>


         <div className="point-group">
           <span className="point-value">Academic Support</span>
           <div className="point-descriptions">
             <div className="point-item">
               <span className="point-description">
                 Register as a TA — 4 pts
               </span>
             </div>
             <div className="point-item">
               <span className="point-description">
                 Academic Event — 1 pt (Cap 8)
               </span>
             </div>
           </div>
         </div>


         <div className="point-group">
           <span className="point-value">Flagship</span>
           <div className="point-descriptions">
             <div className="point-item">
               <span className="point-description">
                 10-Year Anniversary — 6 pts
               </span>
             </div>
           </div>
         </div>


       </div>
     </div>


     {/* POINT REWARDS */}
     <div className="points-container">
       <h2 className="container-title">Point Rewards</h2>
       <div className="rewards-grid">
         <div className="reward-card">
           <h3 className="reward-title">QZ / Crewneck</h3>
           <p className="reward-value">45 Points</p>
         </div>
         <div className="reward-card">
           <h3 className="reward-title">Conference Scholarships</h3>
           <p className="reward-value">Top Earners</p>
         </div>
         <div className="reward-card">
           <h3 className="reward-title">Total Possible</h3>
           <p className="reward-value">77 Points</p>
         </div>
       </div>
     </div>


     {topThree.length > 0 && (
       <div className="top-members-section">
         <h2 className="container-title">Top Members</h2>
         <table className="top-members-table">
           <thead>
             <tr>
               <th>Position</th>
               <th>NetID</th>
             </tr>
           </thead>
           <tbody>
             {topThree.map((member, i) => (
               <tr key={member.netid}>
                 <td>{i + 1}</td>
                 <td>{member.netid}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}

     {/* VIEW POINTS */}
     <div className="view-points">
       <h1>View Points</h1>
       <h2>Enter your netid below to see your points</h2>
       <form id="points-form">
         <input
           type="text"
           id="netID"
           name="netID"
           style={{
             paddingLeft: "10px",
             paddingRight: "10px",
             textAlign: "center",
           }}
         />
         <button type="submit" id="myButton" onClick={point_set}>
           Get Points
         </button>
         <h3>{points}</h3>
       </form>
     </div>
   </div>
 );
}
