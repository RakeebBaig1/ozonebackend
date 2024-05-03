const asyncHandler = require("express-async-handler")
const Location = require("../models/baseLocations")
const LocationsDetails = require("../models/locationsDetails")

module.exports.add_location = asyncHandler(async(req, res, next)=>{

    const { loc_name, lat, lng} = req. body
    try{
        const newLocation = await Location.create({
            Location_Name: loc_name,
            Lat: lat,
            Lon: lng
        })
        console.log("new location added", newLocation)
        const loc_details = await LocationsDetails.create({Location: newLocation._id})
        console.log(loc_details)
    
        res.status(201).json(newLocation)

    }catch(error)
    {
        res.status(400)
        throw new Error("Invalid location data")
    }
   
})

module.exports.get_location = asyncHandler( async(req, res, next)=>{
    try{

        const locations = await Location.find()
        .populate({
            path: 'locationDetails',
            select: 'Reading_ID Reading_Date Reading_Time UV_A_Value UV_B_Value'
          });

        if(locations){
            res.status(200).json(locations)
        }
        else{
            res.status(400)
            throw new Error("Cant find locations")
        }
    }catch(error)
    {
        res.status(400)
        throw new Error("Error retrieving locations")
    }
})

module.exports.update_location = asyncHandler( async(req, res, next)=>{
    console.log(req.params.id)
    const LocationId  = req.params.id
    const location = await Location.findOne({LocationId: LocationId})
    console.log(location)
    if(location)
    {

        location.Location_Name = req.body.name
        location.Lat = req.body.lat
        location.Lon = req.body.lng
        const updatedLocation = await location.save()
    
        res.status(200).json(updatedLocation)
    }
    else{
        res.status(400)
        throw new Error("Cant find location")
    }
})