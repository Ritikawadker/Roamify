const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : '687fcef36fcc7f9869e4d607'}));    //set this owner Id to each single database 
    await listing.insertMany(initData.data);   //initData itself is an object and data is an key define in data.js
    console.log("connection with initialization");
};
initDB();