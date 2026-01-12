const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {ListingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("connected to DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Hi, I'm the root");
});

const validateListing=(req,res,next)=>{
  let {error}=ListingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw newExpressError(400,errMsg);
  }
  else{
    next();
  }
};

const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw newExpressError(400,errMsg);
  }
  else{
    next();
  }
};

// INDEX
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// CREATE
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
  let result=ListingSchema.validate(req.body);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// EDIT
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// DELETE
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//REVIEWS POST ROUTE
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
 let listing = await Listing.findById(req.params.id).populate("reviews");
 let newReview=new Review(req.body.review);
 listing.reviews.push(newReview);
 await newReview.save();
 await listing.save();
 res.redirect(`/listings/${listing._id}`);
}));
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.render("error.ejs",{message});
  //res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("Server is listening on 8080");
});
