const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const locationDetailSchema = mongoose.Schema({
    LocationID: { type: Number },
    Reading_ID: { type: Number },
    Reading_Date: { type: String },
    Reading_Time: { type: String },
    Logging_Date: { type: String },
    Logging_Time: { typeL: String },
    UV_A_Value: { type: Number },
    UV_B_Value: { type: Number },
    Location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }
})


module.exports = mongoose.model("LocationDetail", locationDetailSchema)
