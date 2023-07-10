const router = require("express").Router();
const Movie = require("../models/Movie")
const verifyToken = require("../verifyToken")

// Create a Movie

router.post("/", verifyToken, async(req,res)=>{
    if(req.user.isAdmin){
        const newMovie = new Movie(req.body);

        try{
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        }
        catch(err){
            res.status(500).json(err);
        }
    }

    else{
        res.status(403).json("You are not allowed to create the movie")
    }
    
})

// Update

router.put("/:id", verifyToken, async(req,res)=>{
    if(req.user.isAdmin){
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,{$set : req.body}, {new : true});
            res.status(200).json(updatedMovie);
        }
        catch(err){
            res.status(500).json(err);
        }
    }

    else{
        res.status(403).json("You are not allowed to update the movie")
    }
    
})

// Delete

router.delete("/:id", verifyToken, async(req,res)=>{
    if(req.user.isAdmin){

        try{
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Movie Deleted Successfully!");
        }
        catch(err){
            res.status(500).json(err);
        }
    }

    else{
        res.status(403).json("You are not allowed to delete the movie")
    }
    
})

// Get a movie

router.get("/find/:id", verifyToken, async(req,res)=>{

        try{
            const movie = await Movie.findById(req.params.id);
            res.status(200).json(movie);
        }
        catch(err){
            res.status(500).json(err);
        }
    
})

// get random movie on the featured page

router.get("/random", async(req,res)=>{
    const type = req.query.type;
    let movie;  
    try{ 
        if(type === "series"){
            movie = await Movie.aggregate([
                {$match : {isSeries : true}},
                {$sample : {size : 1}},
            ])
        }
        else{
            movie = await Movie.aggregate([
                {$match : {isSeries : false}},
                {$sample : {size : 1}},
            ])
        }

        res.status(200).json(movie);
    }
    catch(err){
        res.status(err).json(err);
    }
})

// get all movies
router.get("/", verifyToken, async(req,res)=>{
     if(req.user.isAdmin){
        try{
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        }
        catch(err){
            res.status(500).json(err);
        }
     }

     else{
        res.status(403).json("You are not authenticated.")
     }
    
    
})
module.exports = router;