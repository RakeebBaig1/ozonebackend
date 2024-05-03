const { add_location, get_location, update_location } = require("../controller/adminController")
const { protect } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/add_location", protect, add_location )
router.get("/get_location", protect, get_location )
router.patch("/update_location/:id", protect, update_location)

module.exports = router