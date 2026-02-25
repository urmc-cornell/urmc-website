import { React, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import EboardCard from "../components/EboardCard.js";
import "../styles/Leadership.css";
import EboardPopup from "../components/eboardPopup.js";

export default function Leadership() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [popupActive, setPopupActive] = useState(false);
  const [eboardList, setEboardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leadership data when component mounts
  useEffect(() => {
    fetchLeadershipData();
  }, []);

  // Function to fetch and transform leadership data from Supabase database
  async function fetchLeadershipData() {
    try {
      // Query Supabase for members with role "eboard"
      const { data, error } = await supabase
        .from("members")
        .select(
          `
            id,
            position,
            headshot_url,
            secondary_headshot_url,
            first_name,
            last_name,
            major,
            instagram_url,
            linkedin_url,
            ask_about,
            bio,
            role
          `
        )
        .contains("role", ["eboard"]);

      if (error) throw error;

      if (error) throw error;

      // Define position priority order
      const positionOrder = {
        "Co - President": 1,
        "Vice - President": 2,
        "Treasurer": 3,
        "Secretary": 4,
        // Add other positions and their priorities...
      };
  

      // Transform database records into format needed for EboardCard components
      const transformedData = data.map((member) => ({
        id: member.id,
        title: member.position || "",
        image: member.headshot_url,
        name: `${member.first_name} ${member.last_name}`,
        secondaryImage: member.secondary_headshot_url || member.headshot_url, // Fallback to primary image if no secondary
        majors: member.major,
        insta: member.instagram_url,
        linkedIn: member.linkedin_url,
        askAbout: member.ask_about || [], // Default to empty array if null
        bio: member.bio,
        popup: true,
      }))
      .sort((a, b) => {
        // If both are Co-Presidents, sort alphabetically by name
        if (a.title.includes("Co-President") && b.title.includes("Co - President")) {
          return a.name.localeCompare(b.name);
        }
        // If both are Vice-Presidents, sort alphabetically by name
        if (a.title.includes("Vice-President") && b.title.includes("Vice - President")) {
          return a.name.localeCompare(b.name);
        }
        
        // Put Co-Presidents first
        if (a.title.includes("Co-President")) return -1;
        if (b.title.includes("Co-President")) return 1;
        
        // Put Vice-Presidents second
        if (a.title.includes("Vice-President")) return -1;
        if (b.title.includes("Vice-President")) return 1;
        
        // Sort rest alphabetically by title, then by name
        if (a.title === b.title) {
          return a.name.localeCompare(b.name);
        }
        return a.title.localeCompare(b.title);
      });

      setEboardList(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Update loading state regardless of success/failure
    }
  }

  // Handler for when an eboard card is clicked
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setPopupActive(card.popup);
  };

  // Handler for closing the popup modal
  const handleClose = (active) => {
    setSelectedCard(null);
    setPopupActive(active);
  };

  // Show loading/error states while data is being fetched
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render the leadership page
  return (
    <div className='leadership-page'>
      <h1 className="leadership">Executive Board</h1>
      <h2 className="fall22">Fall 2025</h2>
      {/* Popup modal component for showing detailed member info */}
      <EboardPopup
        trigger={popupActive}
        card={selectedCard}
        setTrigger={handleClose}
      />
      <div className="grid-container-container">
        <div className="grid-container">
          {/* Map through eboard members and render cards */}
          {eboardList.map((card) => (
            <div
              key={card.id}
              className="grid-item"
              onClick={() => handleCardClick(card)}
            >
              <EboardCard
                imageURL={card.image}
                title={card.title}
                name={card.name}
                onClick={() => handleCardClick(card)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
