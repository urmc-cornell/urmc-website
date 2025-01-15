import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function populateEvents() {
  try {
    const fileContent = fs.readFileSync(
      "./src/Supporting/sp23-events.csv",
      "utf-8"
    );
    const csvRecords = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Transform CSV data to match events table schema
    const transformedRecords = csvRecords.map((record) => ({
      name: record["Event Name"],
      date: new Date(record["event date"]).toISOString(),
      description: record.blurb,
      flyer_url: record.flyer,
      instagram_url: record.insta_url,
      semester: "sp23",
    }));

    const { data, error } = await supabase
      .from("events")
      .upsert(transformedRecords);

    if (error) {
      console.error("Error inserting events:", error);
      return;
    }

    console.log("Successfully imported events!");
  } catch (error) {
    console.error("Error:", error);
  }
}

populateEvents();
