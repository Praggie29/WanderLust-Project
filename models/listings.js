const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/child-and-adult-decorating-a-christmas-tree-1C36bKRQ3-M",
        
        set:(v)=> v===""? "https://unsplash.com/photos/child-and-adult-decorating-a-christmas-tree-1C36bKRQ3-M":v,
    },
    price:Number,
    location:String,
    country:String,
});
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;