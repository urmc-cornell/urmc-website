import { supabase } from "./lib/supabaseClient.js";
import fs from "fs";



async function populateLeadership() {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(
      "./src/Supporting/Leadership-Constants.json"
    );
    const leadershipData = JSON.parse(rawData);

    const { error } = await supabase
      .from("members")
      .insert(leadershipData, { onConflict: "netid", ignoreDuplicates: true });

    if (error) {
      console.error("Error inserting data:", error);
      return;
    }

    console.log("Successfully populated leadership data!");
  } catch (error) {
    console.error("Error:", error);
  }
}

populateLeadership();
