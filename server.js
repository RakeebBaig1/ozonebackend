const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware")
const adminRoutes = require("./routes/adminRoutes")
const readingRoutes = require("./routes/readingRoutes")
const reportRoutes = require("./routes/reportRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express()

//middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use(cors({
        origin: ["http://localhost:3000"],
        credentials: true
    }
))

app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/report", reportRoutes)
app.use("/api/reading", readingRoutes)

const PORT = process.env.PORT || 5000
const MONGO = process.env.MONGODB_URL

app.use(errorHandler)

mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("MongoDB connectionn established")
    app.listen(PORT, ()=>{
        console.log(`Server is running on Port ${PORT}`)
    })
})
.catch(error=>{
    console.log("Error connecting with the mongoDb databse", error)
})