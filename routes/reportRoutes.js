const { getUvReport, getOzoneReport } = require("../controller/reportController")
const { protect } = require("../middlewares/authMiddleware")

const router = require("express").Router()

// router.get('/uv', protect, getUvReport)
router.get('/uv', getUvReport)
// router.get('/ozone', protect, getOzoneReport)
router.get('/ozone', getOzoneReport)


module.exports = router