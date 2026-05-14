const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  console.log("Testing connection to:", process.env.SUPABASE_URL);
  try {
    const { data, error } = await supabase.from("leads").select("*").limit(1);
    if (error) {
      console.error("Supabase Error:", error);
    } else {
      console.log("Success! Data:", data);
    }
  } catch (err) {
    console.error("Catch Error:", err);
  }
}

test();
