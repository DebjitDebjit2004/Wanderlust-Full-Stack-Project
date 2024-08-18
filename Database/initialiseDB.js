const mongoose = require("mongoose");
const allData = require("./data.js");
const listing = require("../DatabaseSchema/schema.js");

main().then(()=> {console.log("Database Connected")}).catch((err) => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function databaseInit(){
    await listing.deleteMany({});
    allData.data = allData.data.map((obj)=>({ ...obj, owner: "66823a8493a4ddc4bf1b8d17"}));
    await listing.insertMany(allData.data);
    console.log("Database initialized");
}

databaseInit();