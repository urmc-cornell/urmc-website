import "../styles/points.css";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { currentSemester } from "../lib/semester.js";
import pointsHeroImage from "../images/view_points_image.png";
import merchImage from "../images/urmc_merch_image.png";
import conferenceImage from "../images/conference_image.png";

export default function Points() {
  const semester = currentSemester();
  const [netidQuery, setNetidQuery] = useState("");
  const [points, setPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchPoints = async (netid) => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("netid, points_tracking!points_tracking_member_id_fkey (points, semester)")
        .eq("netid", netid.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error("Error fetching points:", error);
        setPoints("NetID Not Found");
        return;
      }

      if (!data) {
        setPoints("NetID Not Found");
        return;
      }

      const totalPoints =
        (data.points_tracking || [])
          .filter((record) => record.semester === semester)
          .reduce((sum, record) => sum + record.points, 0) || 0;
      setPoints(`${totalPoints} pts`);
    } catch (error) {
      console.error("Unexpected error:", error);
      setPoints("Error fetching points");
    }
  };

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase.from("members").select(
          "first_name, last_name, netid, points_tracking!points_tracking_member_id_fkey (points, semester)"
        );

        if (error) throw error;

        const boardData = data
          .map((member) => ({
            displayName:
              `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
              member.netid,
            totalPoints: (member.points_tracking || [])
              .filter((record) => record.semester === semester)
              .reduce((sum, record) => sum + record.points, 0),
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 3);

        setLeaderboard(boardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    }

    fetchLeaderboard();
  }, [semester]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!netidQuery.trim()) {
      setPoints("Enter a NetID to continue");
      return;
    }

    await fetchPoints(netidQuery.trim());
  };

  return (
    <div className="points-page">
      <section className="points-hero">
        <div className="hero-copy">
          <h1 className="hero-title">Points</h1>
          <p className="hero-description">
            Our points system rewards active engagement in the URMC community through event attendance and community support.
          </p>
          <a className="hero-cta" href="/events">
            View Upcoming Events
          </a>
        </div>
      </section>

      <section className="view-points-section">
        <div className="points-section-content">
          <div className="view-points-copy">
            <div className="view-points-header">
              <h2>View Your Points</h2>
              <p>Enter your Cornell NetID to view your current points.</p>
            </div>

            <form className="points-form" onSubmit={handleSubmit}>
              <div className="points-form-row">
                <input
                  id="netID"
                  name="netID"
                  type="text"
                  placeholder="abc123"
                  value={netidQuery}
                  onChange={(event) => setNetidQuery(event.target.value)}
                />
                <button type="submit">Enter</button>
                {points !== null && <div className="points-result">{points}</div>}
              </div>
            </form>

            <div className="top-members">
              <div className="top-members-title">Top Members</div>
              <div className="top-members-list">
                {leaderboard.length > 0 ? (
                  leaderboard.map((member, index) => (
                    <div className="top-member-row" key={`${member.displayName}-${index}`}>
                      <div className="member-rank">#{index + 1}:</div>
                      <div className="member-name">{member.displayName}</div>
                      <div className="member-points">{member.totalPoints} pts</div>
                    </div>
                  ))
                ) : (
                  <div className="top-member-row placeholder">
                    <div>Loading leaderboard...</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="view-points-image">
            <img src={pointsHeroImage} alt="Students collaborating at a URMC event" />
          </div>
        </div>
      </section>

      <section className="earn-points-section">
        <div className="section-header">
          <h2>How to Earn Points</h2>
          <p>
            Points are primarily earned by attending events and completing the sign-in form shared at the start of each URMC event.
          </p>
        </div>

        <div className="tier-grid">
          <div className="tier-card">
            <div className="tier-card-header">
              <h3>Tier 1</h3>
              <span>📚</span>
            </div>
            <div className="tier-items">
              <div>
                <span>Academic Event</span>
                <strong>1 pt</strong>
              </div>
              <div>
                <span>Mentor-Mentee Hangout</span>
                <strong>1 pt</strong>
              </div>
              <div>
                <span>Corporate Event</span>
                <strong>1 pt</strong>
              </div>
              <div>
                <span>Professional Dev Event</span>
                <strong>2 pts</strong>
              </div>
              <div>
                <span>Alumni Event</span>
                <strong>2 pts</strong>
              </div>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-card-header">
              <h3>Tier 2</h3>
              <span>⚡</span>
            </div>
            <div className="tier-items">
              <div>
                <span>General Body Meeting</span>
                <strong>3 pts</strong>
              </div>
              <div>
                <span>Join Mentorship Program</span>
                <strong>3 pts</strong>
              </div>
              <div>
                <span>Web Development Event</span>
                <strong>4 pts</strong>
              </div>
              <div>
                <span>Design Event</span>
                <strong>4 pts</strong>
              </div>
              <div>
                <span>Register as a TA</span>
                <strong>4 pts</strong>
              </div>
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-card-header">
              <h3>Tier 3</h3>
              <span>🏆</span>
            </div>
            <div className="tier-items">
              <div>
                <span>General Body Social</span>
                <strong>5 pts</strong>
              </div>
              <div>
                <span>10-Year Anniversary</span>
                <strong>6 pts</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rewards-section">
        <div className="section-header rewards-header">
          <h2>Rewards</h2>
        </div>

        <div className="reward-grid">
          <div className="reward-card">
            <div className="reward-copy">
              <strong>URMC Merch</strong>
              <span>45 pts</span>
            </div>
            <img src={merchImage} alt="URMC crewneck merch" />
          </div>

          <div className="reward-card">
            <div className="reward-copy">
              <strong>Conference Scholarship</strong>
              <span>Top Earners</span>
            </div>
            <img src={conferenceImage} alt="URMC members at a conference" />
          </div>
        </div>
      </section>
    </div>
  );
}
