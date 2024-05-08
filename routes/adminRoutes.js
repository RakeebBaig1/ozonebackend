const { add_location, get_location, update_location, delete_Location } = require("../controller/adminController")
const { protect } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/add_location", protect, add_location )
router.get("/get_location", protect, get_location )
router.patch("/update_location/:id", protect, update_location)
router.delete('/delete_Location/:name', protect, delete_Location)

module.exports = router