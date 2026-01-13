const express=require("express");
const router=express.Router();

//Index route for Users
router.get("/",(req,res)=>{
    res.send("Get for users");
});

//Show route for Users
router.get("/:id",(req,res)=>{
    res.send("Get for users id");
});

//Post route for Users
router.post("/",(req,res)=>{
    res.send("Post for users");
});

//Delete route for Users
router.delete("/:id",(req,res)=>{
    res.send("Delete for users");
});

module.exports=router;