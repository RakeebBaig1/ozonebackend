const { loginUser, registerUser, logoutUser } = require("../controller/userController")
const { protect } = require("../middlewares/authMiddleware")

const router = require("express").Router()

router.post("/loginUser", loginUser)
router.post("/registerUser", registerUser)
router.get("/logoutUser", logoutUser)
router.get("/protectedRoute", protect, async(req, res, next)=>{
    console.log("user in protected route", req.user)
    res.status(200).json({
        user: req.user
    })
})

module.exports = router