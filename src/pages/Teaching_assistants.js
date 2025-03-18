import { React, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import TACard from "../components/TACard.js";
import "../styles/Leadership.css";

export default function TA_page() {
  const [TAList, setTAList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch TA data when component mounts
  useEffect(() => {
    fetchTAData();
  }, []);

  // Function to fetch and transform leadership data from Supabase database
  async function fetchTAData() {
    try {
      // Query Supabase for members with role "ta"
      const { data, error } = await supabase
        .from("members")
        .select(
          `
            id,
            netid,
            first_name,
            last_name,
            role,
            course
          `
        )
        .contains("role", ["ta"]);

      if (error) throw error;
  

      // Transform database records into format needed for TA card components
      const sortedData = Object.values(
        data.reduce((acc, member) => {
          // Ensure `member.course` is an array, otherwise default to ["Unknown"]
          const courses = Array.isArray(member.course) && member.course.length > 0
            ? member.course
            : ["Unknown"];
      
          // Add the member to each course they teach
          courses.forEach((course) => {
            if (!acc[course]) {
              acc[course] = { course, members: [] };
            }
            acc[course].members.push({
              id: member.id,
              name: `${member.first_name} ${member.last_name} ${member.netid}`,
              course, // Store the individual course they are being grouped under
              netid: member.netid,
            });
          });
      
          return acc;
        }, {})
      )
        .sort((a, b) => a.course.localeCompare(b.course)) // Sort courses alphabetically
        .map((group) => ({
          course: group.course,
          members: group.members.sort((a, b) => a.name.localeCompare(b.name)), // Sort members alphabetically per course
        }));

      setTAList(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Update loading state regardless of success/failure
    }
  }

  // Show loading/error states while data is being fetched
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render the TA page
  return (
    <div className='leadership-page'>
      <h1 className="leadership">TA Directory</h1>
      <h2 className="fall22">Spring 2025</h2>
      <div className="grid-container-container">
        <div className="grid-container">
          {/* Map through TAs and render cards */}
          {TAList.map((card) => (
            <div
              key={card.id}
              className="grid-item"
            >
              <TACard
                title={card.course}
                name={card.members.map((member) => member.name).join("\n")}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
