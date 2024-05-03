const asyncHandler = require("express-async-handler")
const LocationsDetails = require("../models/locationsDetails")
const Location = require("../models/baseLocations")


module.exports.add_new_reading = asyncHandler( async(req, res, next)=>{

    const  LocationId  = req.params.id
    const { UV_A_Value, UV_B_Value, Reading_Id, Reading_Date, Reading_Time } = req.body

    const location = await Location.findOne({LocationId: LocationId})

    if(location)
    {
        const dateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60000).toISOString();

        const [date, time ] = dateTime.split("T")
        const locationReading = await LocationsDetails.create({
            UV_A_Value,
            UV_B_Value,
            Reading_ID: Reading_Id,
            LocationID: LocationId,
            Location: location._id,
            Reading_Date: Reading_Date,
            Reading_Time: Reading_Time,
        })

        location.locationDetails.push(locationReading._id)
        await location.save()

        res.status(200).json(locationReading)
    }
    else{
        res.status(400)
        throw new Error("Cant find location")
    }
})

module.exports.get_latest_readings = asyncHandler( async(req, res, next)=>{
    try{
        const latest_reading = await LocationsDetails.find({}).sort({$natural: -1}).limit(1)
        .populate("Location", " Location_Name LocationId Lat Lon")
        
        res.status(200).json(latest_reading)
    }catch(error)
    {
        res.status(400)
        throw new Error("Cant find latest reading")
    }
})