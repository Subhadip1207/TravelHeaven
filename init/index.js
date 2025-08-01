const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to DB");
    initDB();
}).then(() => {
    console.log("✅ Seeding complete");
    mongoose.connection.close();
  })
  .catch(err => {
    console.log("❌ Error:", err);
    mongoose.connection.close();
  });
//.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:'6850eaeeff9b9a6789bbb224'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
};

