const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");

  mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
});
