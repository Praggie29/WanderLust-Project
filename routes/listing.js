const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const expressError=require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
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
// INDEX
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// CREATE
router.post("/",validateListing, wrapAsync(async (req, res) => {
  let result=ListingSchema.validate(req.body);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// EDIT
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
module.exports=router;
