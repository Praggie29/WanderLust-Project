const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const listing=require("./models/listing.js");
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL); 
}
app.get("/",(req,res)=>{
    res.end("Hi,I'm the root");
});
app.get("/testListing",async(req,res)=>{
   let sampleListing= new listing({
    title:"My New Villa",
    description:"By the beach",
    price:1200,
    location:"Vizag",
    country:"India",
   });
   await sampleListing.save();
   console.log("Sample was saved");
   res.end("Succefully Tested");

})
app.listen(8080,()=>{
    console.log("Server is listening to 8080");
});