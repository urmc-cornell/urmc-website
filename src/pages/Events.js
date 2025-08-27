import "../styles/Events.css";
import EventsPopup from "../components/eventsPopup.js";
import { React, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);
  const [comingUpEvents, setComingUpEvents] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events data when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetches and processes events data from Supabase database
  async function fetchEvents() {
    try {
      // Query events table for required fields
      const { data, error } = await supabase.from("events").select(`
          id,
          name,
          date,
          description,
          flyer_url,
          instagram_url
        `);

      if (error) throw error;
      console.log("Fetched data:", data); // Log fetched data

      // Transform database records into format needed for display
      const transformedEvents = data.map((event) => {
        // Convert Google Drive URL to direct image URL
        let flyerUrl = event.flyer_url;

        // Handle different Google Drive URL formats by extracting file ID
        // and creating a direct thumbnail URL
        if (flyerUrl.includes("drive.google.com/file")) {
          const fileId = flyerUrl.split("/d/")[1].split("/")[0];
          flyerUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        } else if (flyerUrl.includes("drive.google.com/open?id=")) {
          const fileId = flyerUrl.split("id=")[1];
          flyerUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
          console.log(flyerUrl)
        }

        // Return transformed event object with needed properties
        return {
          id: event.id,
          flyer: flyerUrl,
          blurb: event.description,
          date: new Date(event.date),
          instaLink: event.instagram_url || "", // Default to empty string if no Instagram URL
        };
      });

      // Split events into past and upcoming based on current date
      const now = new Date();
      const upcoming = transformedEvents.filter((event) => event.date >= now);
      const past = transformedEvents.filter((event) => event.date < now);

      // Update state with sorted events
      setComingUpEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Update loading state whether successful or not
    }
  }

  // Handler for when an event card is clicked - shows popup with event details
  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setPopupActive(true);
  };

  // Handler for closing the event popup modal
  const handleClose = (active) => {
    setSelectedEvent(null);
    setPopupActive(active);
  };

  // Show loading/error states while data is being fetched
  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  // Render the events page
  return (
    <div className="page">
      <h1 className="page-title" style={{ textAlign: "center" }}>Events</h1>

      <div className="calendar-container">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=c_c774353cbf4312cb22fc533ead50cc32589840c1ee4a56ec388ad2c4c4d7478a%40group.calendar.google.com&ctz=America%2FNew_York" 
          frameBorder="0"
          scrolling="no"
          title="URMC Google Calendar"
          className="google-calendar-iframe"
        ></iframe>
      </div>
      
    </div>
  );
}
