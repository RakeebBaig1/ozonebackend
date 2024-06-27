const asyncHandler = require("express-async-handler")
const Location = require("../models/baseLocations")
const LocationsDetails = require("../models/locationsDetails")

module.exports.add_location = asyncHandler(async(req, res, next)=>{

    console.log("req", req.body)
    const { name, lat, lng} = req. body
    try{
        if(!name || !lat || !lng)
            {
                res.status(400)
                throw new Error("Please add all fields")
            }
            else{

        const newLocation = await Location.create({
            Location_Name: name,
            Lat: lat,
            Lon: lng
        })
        console.log("new location added", newLocation)
        const loc_details = await LocationsDetails.create({Location: newLocation._id})
        console.log(loc_details)
    
        res.status(201).json(newLocation)
    }

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
    console.log("location req", req.body)
    const LocationId  = req.params.id
    const location = await Location.findOne({LocationId: LocationId})
    console.log("location found", location)
    if(location)
    {
        location.Location_Name = req.body.name
        location.Lat = req.body.lat
        location.Lon = req.body.long
        const updatedLocation = await location.save()
    
        res.status(200).json(updatedLocation)
    }
    else{
        res.status(400)
        throw new Error("Cant find location")
    }
})

module.exports.delete_Location = asyncHandler(async (req, res, next) => {
    const LocationName = req.params.name;
    console.log("site delete controller")

    // Find and delete the location by its name
    const deletedLocation = await Location.findOneAndDelete({ Location_Name: LocationName });
    console.log("site found and delted?", deletedLocation)

    if (!deletedLocation) {
        return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.status(200).json({ success: true, message: 'Location deleted successfully' });
});