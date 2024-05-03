const { loginUser, registerUser, logoutUser } = require("../controller/userController")

const router = require("express").Router()

router.post("/loginUser", loginUser)
router.post("/registerUser", registerUser)
router.get("/logoutUser", logoutUser)
module.exports = router