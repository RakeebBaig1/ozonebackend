const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const locationsSchema = mongoose.Schema({
    LocationId: {type: Number},
    Location_Name: {type: String, required: true},
    Lat: {type: Number, required: true},
    Lon: {type: Number, required: true},
    locationDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LocationDetail"
    }]
})

locationsSchema.plugin(AutoIncrement, { id: "location_id_seq", inc_field: "LocationId" })
module.exports= mongoose.model("Location", locationsSchema)