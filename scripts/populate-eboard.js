import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function populateLeadership() {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(
      "./src/Supporting/Leadership-Constants.json"
    );
    const leadershipData = JSON.parse(rawData);

    const { data, error } = await supabase
      .from("members")
      .upsert(leadershipData, {
        onConflict: "netid", // If same netid exists, update the record
      });

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
