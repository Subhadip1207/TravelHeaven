const mongoose = require("mongoose");
const initData = require("./init/data.js");
const Listing = require("./models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log("✅ Connected to DB");

  try {
    await Listing.deleteMany({});
    console.log("🗑️ Deleted existing listings");

    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: '6850eaeeff9b9a6789bbb224'  // replace with valid user ID in your DB
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("✅ Listings inserted");
  } catch (err) {
    console.error("❌ Error while seeding:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 DB connection closed");
  }
}

main();
