import { supabase } from "../scripts/lib/supabaseClient.js";

async function updateHeadshotsFromBucket() {
  const bucketName = "headshots"; // Your Supabase bucket name

  try {
    // Step 1: Fetch all files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list("eboard", { limit: 1000 });

    if (listError) {
      console.error("Error listing files in bucket:", listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log("No files found in the bucket.");
      return;
    }

    // Step 2: Iterate through files and update database
    for (const file of files) {
      try {
        const fileName = file.name; // e.g., "netidPrimary.jpg" or "netidSecondary.png"
        const [netid, type] = fileName.split(/(?=Primary|Secondary)/); // Split by Primary/Secondary

        if (!netid || !type) {
          console.warn(`Skipping invalid file name: ${fileName}`);
          continue;
        }

        const updates = {};

        // Check if file is for Primary or Secondary and build updates
        if (type.startsWith("Primary")) {
          updates.headshot_url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${bucketName}/eboard/${fileName}`;
        } else if (type.startsWith("Secondary")) {
          updates.secondary_headshot_url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${bucketName}/eboard/${fileName}`;
        }

        // Update the database for this netid if there's an update to make
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from("members")
            .update(updates)
            .eq("netid", netid);

          if (updateError) {
            console.error(`Error updating ${netid}:`, updateError);
          } else {
            console.log(`Successfully updated headshots for ${netid}`);
          }
        }
      } catch (error) {
        console.error(`Unexpected error processing file ${file.name}:`, error);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

updateHeadshotsFromBucket();
