import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function populatePoints() {
  try {
    const fileContent = fs.readFileSync(
      "./src/Supporting/fa24-points.csv",
      "utf-8"
    );
    const csvRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // First, get all members to map netid to member_id
    const { data: members, error: memberError } = await supabase
      .from("members")
      .select("id, netid");

    if (memberError) {
      console.error("Error fetching members:", memberError);
      return;
    }

    // Create netid to member_id mapping
    const memberMap = {};
    members.forEach((member) => {
      memberMap[member.netid.toLowerCase()] = member.id;
    });

    // Transform CSV data
    const transformedRecords = csvRecords
      .map((record) => {
        const netid = record.Netid.toLowerCase();
        const member_id = memberMap[netid];

        if (!member_id) {
          console.error(`No member found for netid: ${netid}`);
          return;
        }

        return {
          member_id: member_id,
          points: parseInt(record.Points),
          semester: "fa24", // Adjust semester as needed
          date_earned: new Date().toISOString(),
          reason: "Transfer from SP24 to New Database",
        };
      })
      .filter((record) => record !== null);

    const { data, error } = await supabase
      .from("points_tracking")
      .upsert(transformedRecords);

    if (error) {
      console.error("Error inserting points:", error);
      return;
    }

    console.log("Successfully imported points!");
    console.log("Records processed:", transformedRecords.length);
  } catch (error) {
    console.error("Error:", error);
  }
}

populatePoints();
